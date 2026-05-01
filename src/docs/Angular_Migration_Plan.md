# Angular 18+ Migration Plan

React + Redux + RTK Query → Angular 18+ with TanStack Query and Signals

---

## Section 1 — Project Skeleton / Setup

### 1.1 Login Page

| React | Angular |
|-------|---------|
| `useLoginMutation` (RTK Query) | Inject API service, call `injectMutation` (TanStack Query) |
| `dispatch(setUser(...))` | Call `authService.setUser(...)` |
| `dispatch(setPermissions(...))` | Call `authService.setPermissions(...)` |
| `sessionStorage` redirect | Same — read on login success, navigate via `Router` |
| `useNavigate` | Inject `Router` |

`LoginInput` → CVA component (same pattern as `FormInput`). Password visibility toggle stays as internal component state.

---

### 1.2 API Service

**Recommendation: `@tanstack/angular-query-experimental`** over a manual cache layer.

- Provides `injectQuery` and `injectMutation` (signal-based)
- Key-based cache invalidation replaces RTK Query `tagTypes`
- Familiar API — reduces learning curve

**HttpInterceptor** replaces `baseQueryWithReauth`:

```ts
// Same deduplication pattern from baseApi.ts — ports directly
let refreshPromise: Promise<RefreshResponse> | null = null;

intercept(req, next) {
  return next.handle(req.clone({ withCredentials: true })).pipe(
    catchError(err => {
      if (err.status === 401) {
        if (!refreshPromise) {
          refreshPromise = this.http.post(EP.REFRESH, {})
            .toPromise()
            .finally(() => refreshPromise = null);
        }
        return from(refreshPromise).pipe(
          switchMap(result => {
            this.authService.setUser(result.user);
            this.authService.setPermissions(result.permissions);
            return next.handle(req.clone({ withCredentials: true }));
          }),
          catchError(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
}
```

Key points:
- `credentials: 'include'` → `withCredentials: true` on every request (set in interceptor)
- `refreshPromise` single-variable deduplication prevents concurrent refresh race condition — same pattern as React source
- Login and refresh endpoints excluded from reauth logic

---

### 1.3 Routing

| React | Angular |
|-------|---------|
| `RouteConfig[]` with `lazy()` | Angular `Routes` with `loadComponent` |
| `requiredPermissions: Permissions[]` | `data: { permissions: Permissions[] }` on each route |
| `<Outlet />` | `<router-outlet>` |
| `RouteGuard` component | `CanActivateFn` |
| `<Navigate to="/login">` | `router.navigate(['/login'])` inside guard |

**Guard pattern:**

```ts
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = route.data['permissions'] as Permissions[] ?? [];

  if (required.length > 0 && !auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }
  if (required.length > 0 && !required.every(p => auth.hasPermission(p))) {
    return router.createUrlTree(['/unauthorized']);
  }
  return true;
};
```

Nested routes handled declaratively in the route array — no recursive `renderRoute` function needed.

---

### 1.4 Auth Setup

**`AuthService`** replaces `authSlice` + `usePermissions` hook:

```ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);

  readonly isAuthenticated$ = this.currentUserSubject.pipe(
    map(userObj => userObj !== null)
  );

  login(user: AuthUser) { this.currentUserSubject.next(user); }
  logout() { this.currentUserSubject.next(null); }
  hasPermission(p: Permissions) {
    return this.currentUserSubject.getValue()?.permissions.includes(p) ?? false;
  }
}
```

**Why BehaviorSubject over Signals here:** Auth state is set by an API response (login/refresh) and the interceptor needs to interact with it reactively via the Observable pipeline. `isAuthenticated$` as an `Observable<boolean>` integrates naturally with `CanActivateFn` guards, which support `Observable<boolean>` returns.

**Signals are reserved for module-level UI state** (entityManager, taskManager, listView, header) — client state that is not API-derived and needs no async pipeline. See Section 4.

**No hook abstraction needed** — inject `AuthService` directly in guards and components. `usePermissions` hook has no Angular equivalent; callers inject the service.

---

### 1.5 Logging

Simple environment-conditional service:

```ts
@Injectable({ providedIn: 'root' })
export class LoggingService {
  log(...args: unknown[]) {
    if (!environment.production) console.log(...args);
  }
  error(...args: unknown[]) {
    if (!environment.production) console.error(...args);
  }
}
```

---

### 1.6 Gaps to Address

| Gap | Solution |
|-----|---------|
| `toastMiddleware` (RTK success/error toasts by endpoint name) | Handle in `HttpInterceptor` or TanStack Query mutation `onSuccess`/`onError` callbacks; reuse `successMessages`/`errorMessages` maps from `rtkMiddleware.ts` |
| Non-auth Redux slices (`entityManagerSlice`, `taskManagerSlice`, `listViewSlice`, `headerSlice`) | Port alongside their corresponding modules as signals-based services — not upfront |

---

## Section 2 — Components

### 2.1 FormBuilder

**FormGroup ownership:** Parent page creates and owns the `FormGroup`, passes it as `@Input() form: FormGroup` to `FormBuilder`. FormBuilder registers CVA controls via `form.addControl(...)`. This mirrors React's `FormLayout` wrapping pattern without needing a `FormLayout` equivalent.

**CVA components** (replace RHF `register`/`useController`):
- `FormInput` → CVA
- `FormTextArea` → CVA
- `SingleSelectFormInput` → CVA; internal dropdown state + `writeValue`/`onChange` boundary
- `MultiSelectFormInput` → CVA; propagates comma-joined string, internal multi-select UI
- `LoginInput` → CVA; same as `FormInput` + password visibility toggle

**Plain components** (not CVA):
- `UploadFileFormInput` → `@Output() fileUpload` and `@Output() errorChange`; never RHF-integrated in React either

**FormBuilder component:** Kept. Uses `@switch` for field type dispatch. `FormLayout` is not ported — Angular Reactive Forms handles form state, `valueChanges.subscribe()` handles error clearing, `formGroup.reset()` handles initial data.

**Schema validation:** Custom `ValidatorFn` functions added to each `FormControl`'s validator array. `Validators.compose()` for complex rules. Cross-field validation via `FormGroup`-level validators. No Yup equivalent needed.

---

### 2.2 StandardTable

| React | Angular |
|-------|---------|
| `forwardRef` + `useImperativeHandle` | Public `clearSelectedRows()` method on class; parent uses `@ViewChild(StandardTableComponent)` |
| `useEffect(() => setSortedRows(rows), [rows])` | `@Input() set rows(v) { this.sortedRows = v ?? []; }` setter |
| `useNavigate` | Inject `Router` |
| `useCallback` | Plain class methods — no memoization needed |
| `document.addEventListener('mousedown')` in `SelectForTable` | `@HostListener('document:mousedown', ['$event'])` or extract as a reusable click-outside directive |
| `React.Fragment` | `<ng-container>` |

**`TableCellRenderer`** and **`SelectForTable`** are isolated child components — port first, then `StandardTable` assembles them. `SelectForTable`'s `requestAnimationFrame` position calculation carries over as-is (DOM API).

---

### 2.3 Filter

Same isolated-first assembly pattern: port `CharFieldFilter`, `DateFieldFilter`, `BooleanFieldFilter`, `NumericFieldFilter` → then `FilterOptions` → then `FilterPopup` + `TemplateList` + `SaveTemplatePopup` → then `Filter` container.

| React | Angular |
|-------|---------|
| Callback props (`onApply`, `onSaveTemplate`, `onClose`) | `@Output() apply`, `@Output() saveTemplate`, `@Output() close` EventEmitters |
| `useEffect([initialState])` in FilterPopup | `@Input() set initialState(v) { this.filters = v; }` setter |
| `filterConfig` object switch on `datatype` | `@switch` block dispatching to child components |
| Dual state (`filterState` + `tempFilterState`) | Two class properties; temp resets to committed on cancel |

**`FilterButton`** → plain Angular component with `@Input()` for `templateName`, `isDisabled`, `isActive` and `@Output() clicked`.

---

### 2.4 PermissionsTable + PermissionsTableGroup

Straightforward port — pure JSX + styles with no framework-specific hooks.

| React | Angular |
|-------|---------|
| `React.Fragment` wrapping standard + special rows | `<ng-container>` |
| `immer` `produce()` for immutable toggle updates | Either keep `immer` (framework-agnostic) or replace with `structuredClone` + spread |
| `useState` in `PermissionsTableGroup` | Class property `groupPermissions` |
| Callback prop `onPermissionChange` | `@Output() permissionChange` EventEmitter |

`Toggle` → plain component with `@Input() isOn`, `@Input() isDisabled`, `@Output() toggle`.

---

### 2.5 Pagination

| React | Angular |
|-------|---------|
| `ReactSVG` for SVG icons | Inline SVGs as Angular components, or `<img [src]>` if color control not needed |
| Callback props (`setCursor`, `setPageSize`) | `@Output() cursorChange`, `@Output() pageSizeChange` EventEmitters |
| `PaginationProps` types | Carry over as TypeScript interfaces — no changes |

Cursor-based pagination logic (first/previous/next/last) carries over as a class method switching on navigation type.

---

## Section 3 — Hooks and Utilities

### Hook → Angular mapping

| Hook type | Angular equivalent |
|-----------|-------------------|
| Hooks that touch APIs or global state | `@Injectable` services |
| Hooks that are pure logic wrappers | Standalone functions in `utils/` |
| Hooks that compose other hooks | Inject the underlying service at the call site — no wrapper |

### Key hook migrations

**`useListViewState`** → `ListViewStateService`
- Stores cursor, filters, searchTerm, pageSize per `ModuleNameKey`
- Use a `Map<ModuleNameKey, signal<ListViewState>>` in a root service, or provide at module level for isolation
- Each module reads/writes its own slice via `getState(moduleKey)` / `setState(moduleKey, value)`

**`usePermissions`** → inject `AuthService` directly. No wrapper needed.

**`useNavigate`** → inject `Router` directly at call site.

**Pure utility hooks** (debounce, previous value, etc.) → standalone functions in `utils/`. No class wrapper required.

### Utility functions

Port as static methods in utility classes or standalone exported functions — no changes to logic:
- `textUtils` (truncate, transform)
- `dateTimeUtils` (UTC conversion)
- `logUtils` (environment-conditional logging — or replace with `LoggingService`)
- `inputUtils` (sanitize)
- `tableSortUtils` (sort logic — pure function, carries over unchanged)

---

## Section 4 — Module Port

### Assembly pattern

For each module page:
1. Paint the DOM using Angular template syntax
2. Import and assemble ported components from Section 2
3. Add API calls via `injectQuery`/`injectMutation` (TanStack Query)
4. Transform API responses into component `@Input()` shapes
5. Wire `@Output()` EventEmitters to handler methods

### React → Angular template mappings

| React | Angular |
|-------|---------|
| `useMemo(() => derived, [deps])` | `computed(() => derived)` signal or `get` getter |
| `useCallback(fn, [deps])` | Plain class method — no memoization needed |
| `useEffect([dep])` for side effects on data | `effect()` or `toObservable(signal).subscribe()` |
| JSX slot prop (`additionalContent`) | `<ng-content select="[additionalContent]">` |
| Component passed as prop (`config.TabsComponent`) | `<ng-content>` or named content projection slot |

### TaskListView / TicketListView — config object pattern

Both components use a runtime **strategy pattern** — a single generic component driven by a `config` object supplying query hooks, column definitions, route builders, and transform functions.

This does not translate directly to Angular because template compilation is static.

**Recommended approach for initial port: separate per-module components.**

`TaskListViewComponent`, `TicketListViewComponent` — each wires its own query service and column config. Duplicates the structure but each is self-contained and easy to maintain independently.

**Angular-idiomatic refactor (second pass):** Abstract base component holds shared state (cursor, filters, pageSize, sortConfig). Module subclasses provide their own query call and column config via abstract methods or DI tokens.

### Module-specific state slices

Port alongside their module — not upfront:

| Redux slice | Angular equivalent |
|-------------|-------------------|
| `entityManagerSlice` | `EntityManagerStateService` (signals) |
| `taskManagerSlice` | `TaskManagerStateService` (signals) |
| `listViewSlice` | `ListViewStateService` (signals, keyed by module) |
| `headerSlice` | `HeaderStateService` (signals) |

---

## Key Architectural Decisions

| Decision | Recommendation |
|----------|---------------|
| Server state (API cache) | `@tanstack/angular-query-experimental` |
| Auth state | BehaviorSubject — API-derived, interceptor needs reactive pipeline |
| Client/module state (non-auth) | Signals-based services — not NgRx |
| Token refresh deduplication | Single `refreshPromise` variable in `HttpInterceptor` |
| FormGroup ownership | Parent page owns, passes to FormBuilder as `@Input()` |
| `TaskListView`/`TicketListView` pattern | Separate per-module components for initial port |
| `immer` in `PermissionsTableGroup` | Keep (framework-agnostic) or replace with `structuredClone` |
| `ReactSVG` replacement | Inline SVG components or `<img>` depending on color control needs |
| Toast notifications | `HttpInterceptor` or TanStack Query mutation callbacks; reuse existing message maps |
