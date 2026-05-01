# Angular Interview Prep Checklist (2-5 Years)

## 📚 FOUNDATION (Week 1-2)

### Data Binding
- [ ] **Interpolation** - `{{ variable }}`
- [ ] **Property Binding** - `[property]="value"`
- [ ] **Event Binding** - `(event)="method()"`
- [ ] **Two-Way Binding** - `[(ngModel)]="value"`
- [ ] Understand the difference between all four
- [ ] Know when to use each binding type

### Services & Dependency Injection
- [ ] Create a service with `@Injectable()`
- [ ] Inject service into component using constructor
- [ ] Understand singleton pattern in Angular
- [ ] `providedIn: 'root'` vs module-level providers
- [ ] Service with methods that return values
- [ ] Service with methods that return Observables

### Lifecycle Hooks
- [ ] `ngOnInit` - when and how to use
- [ ] `ngOnDestroy` - cleanup subscriptions
- [ ] `ngAfterViewInit` - access child components
- [ ] `ngOnChanges` - detect input property changes
- [ ] Understand hook execution order
- [ ] Implement at least 3 different hooks in a component

### Observables Basics
- [ ] What is an Observable?
- [ ] `subscribe()` and `unsubscribe()`
- [ ] Memory leak prevention (unsubscribe)
- [ ] `pipe()` method
- [ ] Understanding async operations with Observables

---

## 🔧 INTERMEDIATE (Week 3-4)

### Reactive Forms
- [ ] Create form with `FormBuilder`
- [ ] Create form with `FormGroup` and `FormControl`
- [ ] `formControlName` binding
- [ ] Built-in validators (`required`, `email`, `minlength`)
- [ ] Custom validators
- [ ] Async validators (e.g., username availability check)
- [ ] Form validation and error display
- [ ] Form state management (dirty, touched, valid)
- [ ] Nested `FormGroup`
- [ ] `FormArray` for dynamic form controls

### Template-Driven Forms
- [ ] `ngModel` for form binding
- [ ] Form validation with directives
- [ ] Error messages with `ngIf`
- [ ] Form submission with `(ngSubmit)`
- [ ] Know when to use vs Reactive Forms

### RxJS Operators (Essential)
- [ ] `map` - transform Observable values
- [ ] `filter` - filter Observable values
- [ ] `switchMap` - switch to new Observable (cancels previous)
- [ ] `mergeMap` - merge multiple Observables
- [ ] `catchError` - handle errors in Observable chain
- [ ] `tap` - debug/perform side effects
- [ ] `distinctUntilChanged` - filter duplicate values
- [ ] `debounceTime` - debounce emissions
- [ ] `take` - take first n emissions
- [ ] `takeUntil` - unsubscribe when another Observable emits

### Routing & Navigation
- [ ] Basic routing setup with `RouterModule`
- [ ] Route configuration array
- [ ] `<router-outlet>`
- [ ] `routerLink` directive
- [ ] `Router.navigate()` programmatically
- [ ] Route parameters (`:id`)
- [ ] `ActivatedRoute` to read parameters
- [ ] Query parameters
- [ ] Wildcard route (`**`)
- [ ] Redirect routes

### Route Guards & RBAC
- [ ] `CanActivate` guard for protected routes
- [ ] `CanDeactivate` guard for unsaved changes
- [ ] Role-Based Access Control (RBAC) implementation
- [ ] Check user role before allowing route access
- [ ] Redirect to login/forbidden page
- [ ] Guard with service that returns Observable/Promise/boolean

### Memory Leak Prevention
- [ ] Use `takeUntil` pattern with destroy subject
- [ ] Use async pipe in template `{{ data$ | async }}`
- [ ] Understand when unsubscribe is necessary
- [ ] Implement proper cleanup in `ngOnDestroy`

### Error Handling
- [ ] `catchError` operator in Observable chain
- [ ] Provide fallback value with `of()`
- [ ] Error logging service
- [ ] User-friendly error messages
- [ ] Retry logic with `retry()` operator

---

## 🚀 ADVANCED (Week 5-6)

### Change Detection
- [ ] Default change detection strategy
- [ ] `OnPush` change detection strategy
- [ ] When to use `OnPush`
- [ ] `ChangeDetectorRef.markForCheck()`
- [ ] `ChangeDetectorRef.detectChanges()`
- [ ] Performance benefits of `OnPush`

### Presentational vs Smart Components
- [ ] Smart components (container) - handle logic, fetch data
- [ ] Presentational components (dumb) - display data only
- [ ] Input/Output bindings
- [ ] `@Input()` for passing data to child
- [ ] `@Output()` for emitting events from child

### Services Patterns
- [ ] API service for HTTP calls
- [ ] Service with BehaviorSubject for state management
- [ ] Shared service for component communication
- [ ] Singleton service pattern
- [ ] Service method returning Observable

### State Management with BehaviorSubject
- [ ] Create BehaviorSubject in service
- [ ] `getValue()` for current value
- [ ] `next()` to update value
- [ ] Subscribe to BehaviorSubject in components
- [ ] Avoid direct state mutation

### Signals (Angular 16+)
- [ ] What are Signals vs Observables?
- [ ] `signal()` creation
- [ ] `computed()` derived signals
- [ ] `effect()` for side effects
- [ ] When to use Signals vs Observables
- [ ] Signals with `toSignal()` from Observable

### Interceptors
- [ ] HTTP interceptor creation
- [ ] Add auth token to requests
- [ ] Error handling in interceptor
- [ ] `HttpInterceptor` interface
- [ ] Register interceptor in providers
- [ ] Multiple interceptors execution order

### Subject Types
- [ ] `Subject` - basic publish/subscribe
- [ ] `BehaviorSubject` - remembers last value
- [ ] `ReplaySubject` - remembers multiple values
- [ ] When to use each type
- [ ] Memory management with Subjects

### Directives (Custom)
- [ ] Create custom attribute directive
- [ ] `@HostListener` for DOM events
- [ ] `@HostBinding` for DOM properties
- [ ] `ElementRef` to access DOM
- [ ] Structural directive basics

### Pipes
- [ ] Built-in pipes (`uppercase`, `lowercase`, `date`, `currency`)
- [ ] Create custom pipe
- [ ] Pipe with parameters
- [ ] Pure vs impure pipes

### Async Pipe
- [ ] Use async pipe in template
- [ ] Auto-unsubscribe with async pipe
- [ ] Prevents memory leaks
- [ ] `{{ observable$ | async }}`

---

## 🎯 OPTIMIZATION & POLISH (Week 7)

### Performance Optimization
- [ ] `trackBy` function in `*ngFor`
- [ ] Lazy loading modules
- [ ] Lazy loading routes
- [ ] Preloading strategies
- [ ] Bundle size optimization
- [ ] `OnPush` change detection for large lists

### Compilation Methods
- [ ] JIT (Just-in-Time) compilation
- [ ] AOT (Ahead-of-Time) compilation - default in modern Angular
- [ ] Understand differences and benefits

### Zone.js & NgZone
- [ ] What is Zone.js?
- [ ] `NgZone.runOutsideAngular()` for performance
- [ ] `NgZone.run()` to trigger change detection
- [ ] When to use NgZone

### Testing
- [ ] Unit test component with mocked service
- [ ] Test component with Observables
- [ ] Test forms with ReactiveFormsModule
- [ ] Test route guards
- [ ] `TestBed` setup
- [ ] `fixture.detectChanges()`

### SEO & Accessibility (Frontend Role Bonus)
- [ ] Meta tags with `Meta` service
- [ ] Title service for page titles
- [ ] Semantic HTML
- [ ] ARIA labels for accessibility
- [ ] Keyboard navigation support
- [ ] Color contrast standards

---

## 🧠 BEHAVIORAL & INTERVIEW PREP

### Key Stories to Prepare
- [ ] Complex form implementation (validation, async validators)
- [ ] API integration with error handling and loading states
- [ ] State management solution for component communication
- [ ] Performance optimization (OnPush, trackBy, etc.)
- [ ] Memory leak debugging and fixing
- [ ] RBAC implementation with route guards
- [ ] Observable/RxJS challenge you faced and solved

### Common Interview Questions
- [ ] Explain data binding (all types)
- [ ] Difference between Observables and Promises
- [ ] How do you prevent memory leaks?
- [ ] When would you use OnPush change detection?
- [ ] Explain the difference between Subject and BehaviorSubject
- [ ] How do you handle errors in RxJS?
- [ ] What is dependency injection and why use it?
- [ ] Explain RxJS operators: map, filter, switchMap, catchError
- [ ] How do you implement RBAC with route guards?
- [ ] Reactive forms vs Template-driven forms - when to use each?

---

## 📊 Progress Tracking

**Weeks 1-2 Foundation:** ___ / 20 topics
**Weeks 3-4 Intermediate:** ___ / 35 topics
**Weeks 5-6 Advanced:** ___ / 40 topics
**Week 7 Polish:** ___ / 20 topics

**Total Progress:** ___ / 115 topics

---

## 🎓 Study Tips

1. **Hands-on practice** - Code everything, don't just read
2. **Build projects** - Apply concepts in real scenarios
3. **Explain concepts** - Teach someone or write it down
4. **Debug issues** - When things break, understand why
5. **Read Angular docs** - Official docs are excellent
6. **Practice old interview questions** - Familiarize yourself with patterns
