# ANGULAR INTERVIEW CRASH COURSE (3-5 Days)
## Task-Based Learning - Write Code Yourself

Your advantage: React fundamentals translate directly. Angular is just different syntax for the same concepts.

---

## PROJECT: User Management Dashboard

This single app will cover ALL interview topics. Build incrementally in 3-5 days.

### Core Features to Implement
1. User list with search and filter
2. User detail page with route params
3. Create/Edit user form (Reactive Forms)
4. Protected routes with role-based access
5. API calls with error handling
6. State management with BehaviorSubject
7. RxJS operators (map, filter, switchMap, catchError, takeUntil)
8. Memory leak prevention
9. Change detection optimization

---

## DAY 1: FOUNDATION + SETUP (6 hours)

### Initial Setup (30 min)

TASK: Create a new Angular app with standalone components enabled.

- Create project: `ng new user-dashboard`
- Understand what standalone components are vs NgModules
- Set up your main.ts to bootstrap the app with routes and HttpClient
- Delete default Angular boilerplate

---

### Understanding React to Angular Translation (30 min)

READ and UNDERSTAND these mappings before coding:

React useState → Angular BehaviorSubject + services
React Props → Angular @Input()
React event callbacks → Angular @Output() + EventEmitter
React useEffect → Angular ngOnInit
React useEffect cleanup → Angular ngOnDestroy
React useContext → Angular services (singleton pattern)
React custom hooks → Angular services
React Array.map() → Angular *ngFor directive
React conditional ternary → Angular *ngIf directive

---

### TASK 1: Data Binding - All 4 Types (90 min)

Create your first component: `app.component.ts`

SUBTASK 1A: Implement Interpolation
- Create a component property called `userCount` and set it to 5
- Display this value in the template using interpolation syntax
- Change the value programmatically and verify the display updates

SUBTASK 1B: Implement Property Binding
- Create a boolean property called `isLoading`
- Create a button and bind its disabled property to `isLoading`
- Add a method that toggles `isLoading` when button is clicked
- Verify the button becomes disabled/enabled based on the property

SUBTASK 1C: Implement Event Binding
- Create another button with text "Refresh Users"
- Add a method `onRefresh()` that logs to console
- Bind the button click event to this method
- Test that clicking executes the method

SUBTASK 1D: Implement Two-Way Binding
- Create a property called `searchTerm` with initial value empty string
- Add an input field with [(ngModel)] binding to `searchTerm`
- Every time user types, log the current value to console
- This is Angular's version of React's controlled input pattern
- Remember: you need FormsModule imported for this to work

VERIFICATION: By end of this task, you should understand:
- How data flows from component to template (property binding)
- How events flow from template to component (event binding)
- What two-way binding actually means (combination of both)

---

### TASK 2: Services & Dependency Injection (90 min)

Create: `src/app/services/user.service.ts`

SUBTASK 2A: Create a UserService
- Create a service class with @Injectable decorator
- Add `providedIn: 'root'` - this makes it a singleton
- Add a hardcoded array of mock user objects with id, name, email, role
- Create a method `getUsers()` that returns this array
- Create a method `getUserById(id: number)` that returns a single user

SUBTASK 2B: Inject Service into Component
- In app.component.ts, inject UserService in the constructor
- Call `this.userService.getUsers()` in a new method
- Store the result in a component property
- Display the users in the template using *ngFor
- Verify the service is called once (check console logs)

SUBTASK 2C: Add More Service Methods
- Add method `addUser(user)` that adds to the array
- Add method `updateUser(id, updates)` that modifies a user
- Add method `deleteUser(id)` that removes a user
- Test calling these from your component (for now, just call them on button clicks)

SUBTASK 2D: Create More Services
- Create `AuthService` with property `isLoggedIn: boolean`
- Create `AuthService` with method `logout()` that sets isLoggedIn to false
- Inject AuthService in your component
- Use it to conditionally show/hide a logout button

VERIFICATION: By end of this task, you should understand:
- What dependency injection is and how Angular does it
- Why services are singletons (providedIn: 'root')
- How to create and inject services
- How services hold state and methods for components

---

### TASK 3: Observables & Memory Leak Prevention (90 min)

SUBTASK 3A: Convert Service to Use BehaviorSubject
- Modify UserService: create a BehaviorSubject instead of plain array
- Create observable property `users$` from the BehaviorSubject
- Update getUsers() to return the observable
- Update addUser, updateUser, deleteUser to use `.next()` to update the BehaviorSubject

SUBTASK 3B: Subscribe to Observable in Component
- In app.component.ts, change getUsers() call to subscribe to the observable
- Store result in component property
- Display in template
- Verify that when you call addUser/updateUser/deleteUser, the display updates

SUBTASK 3C: Implement Memory Leak Prevention with takeUntil
- Create a destroy$ subject in your component
- Implement OnInit and OnDestroy interfaces
- Subscribe to users$ but add `.pipe(takeUntil(this.destroy$))`
- In ngOnDestroy, call next() and complete() on destroy$
- This prevents memory leaks when component is destroyed

SUBTASK 3D: Use Async Pipe Instead (Alternative)
- Create a new template section
- Display users using `{{ (users$ | async) as users }}` syntax
- This is even cleaner - async pipe auto-unsubscribes
- Understand that this is the preferred Angular pattern

SUBTASK 3E: Search Functionality with RxJS
- Modify service to have a `searchUsers(term: string)` method
- Inside this method, use the BehaviorSubject and filter the array
- Return as observable
- In component, create a method that calls this
- Understand how observables help with async operations

VERIFICATION: By end of this task, you should understand:
- BehaviorSubject vs plain Observable
- Memory leaks and how to prevent them (takeUntil, async pipe)
- How observables work for multiple subscribers
- Basic RxJS concept (will deep-dive next)

---

## DAY 2: RXJS OPERATORS + ROUTING (6 hours)

### TASK 4: RxJS Operators - Essential 5 (120 min)

SUBTASK 4A: Implement map operator
- Modify SearchComponent or create new component for testing
- Create an observable that emits user objects
- Use `.pipe(map(...))` to transform users to just their names
- Subscribe and display the names
- Understand this is same as JavaScript array.map()

SUBTASK 4B: Implement filter operator
- Use `.pipe(filter(...))` to filter users by role === 'admin'
- Subscribe and display only admins
- Combine with map: `pipe(filter(...), map(...))`
- Understand operator chaining

SUBTASK 4C: Implement switchMap operator (MOST IMPORTANT)
- Create a search input component
- When user types in search box, create an observable from the text
- Use switchMap to call `userService.searchUsers()`
- Display results as user types
- Understand that switchMap cancels previous request when new input comes
- This is critical for search autocomplete patterns

SUBTASK 4D: Implement catchError operator
- Create a fake API call that might fail
- Add `.pipe(catchError(...))` to handle errors
- Provide a fallback value with `of([])` 
- Display error message if needed
- Understand error handling in observable chains

SUBTASK 4E: Implement debounceTime with switchMap
- Combine debounceTime with switchMap for search
- Don't call searchUsers on every keystroke - wait 300ms after user stops typing
- This is real-world optimization
- Understand performance implications

VERIFICATION: By end of this task, you should understand:
- What map, filter, switchMap, catchError do
- When to use switchMap vs mergeMap
- How to chain operators
- Why debounceTime matters for search

---

### TASK 5: Routing & Route Parameters (90 min)

SUBTASK 5A: Set up Basic Routing
- Create app.routes.ts (or use app.routes.ts if already exists)
- Define routes for: home, user-list, user-detail, create-user
- Create components for each route
- Use <router-outlet> in app.component to display routed component
- Add navigation links with routerLink directive

SUBTASK 5B: Implement Route Parameters
- Create user detail route with parameter: `/user/:id`
- In detail component, use ActivatedRoute to read the id parameter
- Call `userService.getUserById(id)` and display that user
- Test by clicking on user from list and being taken to detail page
- Verify the correct user details display for different IDs

SUBTASK 5C: Implement Query Parameters
- Add a filter option to user list: `/users?role=admin`
- Read query parameter from ActivatedRoute
- Filter user list based on role query param
- Understand difference between route params and query params

SUBTASK 5D: Implement Navigation Methods
- In components, use Router service to navigate programmatically
- Add "Back to List" button on detail page that navigates back
- Add "View Details" button on list that navigates to detail with ID
- Implement proper TypeScript typing for route parameters

VERIFICATION: By end of this task, you should understand:
- Route configuration and routing module setup
- Route parameters vs query parameters
- ActivatedRoute to read parameters
- Router service to navigate programmatically

---

## DAY 3: REACTIVE FORMS + AUTHENTICATION (6 hours)

### TASK 6: Reactive Forms - Create & Edit (120 min)

SUBTASK 6A: Create User Form Component
- Create UserFormComponent with a form for creating new users
- Use FormBuilder to create FormGroup with fields: name, email, role
- Add validators: name required and minlength 3, email required and valid email, role required
- Display form in template with formControlName bindings
- Do NOT use ngModel - this is Reactive Forms, not template-driven

SUBTASK 6B: Implement Form Validation Display
- Show error messages for each field when invalid
- Check if field has specific error type (required, email, minlength)
- Disable submit button if form is invalid
- Show validation state (touched, dirty, valid)
- Make UX user-friendly

SUBTASK 6C: Implement Form Submission
- On form submit, get form.value and call userService.addUser()
- Reset form after successful submission
- Redirect to user list after creation
- Show success message to user

SUBTASK 6D: Implement Edit User Form
- Modify form component to work for both create and edit
- Read user ID from route param if editing
- If editing, fetch user and populate form with their values using patchValue()
- On submit, call updateUser instead of addUser
- Handle both create and edit flows in same component

VERIFICATION: By end of this task, you should understand:
- FormBuilder and FormGroup
- formControlName and form state
- Form validation and error display
- Controlled form submission
- Difference from React react-hook-form (similar concept, different syntax)

---

### TASK 7: Route Guards & Role-Based Access Control (RBAC) (90 min)

SUBTASK 7A: Create Authentication Service
- Create AuthService with: currentUser BehaviorSubject, isLoggedIn observable, login() method, logout() method
- Hardcode 2 users: one with role 'admin', one with role 'user'
- login() method accepts username/password and sets currentUser
- logout() method clears currentUser

SUBTASK 7B: Create AuthGuard
- Create CanActivate guard that checks if user is logged in
- If not logged in, redirect to login page
- If logged in, allow access to route
- Add guard to protected routes (anything except login page)

SUBTASK 7C: Create RoleGuard for Admin Routes
- Create another guard that checks if user.role === 'admin'
- Use this on admin-only routes like user management
- Redirect to forbidden page if user is not admin
- Test with both admin and regular user login

SUBTASK 7D: Add Login/Logout UI
- Create login component with username/password form
- Add logout button in header that calls authService.logout()
- Show current user name in header if logged in
- Show login link in header if not logged in

SUBTASK 7E: Protect User Management Routes
- Apply AuthGuard to all routes except login
- Apply RoleGuard to create/edit/delete user routes
- Test that regular users cannot access admin routes
- Test that logged out users are redirected to login

VERIFICATION: By end of this task, you should understand:
- Route guards and CanActivate interface
- How to implement custom guards
- Role-based access control pattern
- Redirecting users based on auth state

---

## DAY 4: STATE MANAGEMENT & OPTIMIZATION (6 hours)

### TASK 8: BehaviorSubject for State Management (90 min)

SUBTASK 8A: Create State Service
- Create StateService that manages entire app state: users, currentUser, loading, error
- Use BehaviorSubject to hold state object
- Create public observables: users$, currentUser$, loading$, error$
- Create methods: setUsers(), setLoading(), setError(), setState()

SUBTASK 8B: Replace Service Usage
- Modify UserService to use StateService instead of managing its own users
- Update all methods (getUsers, addUser, etc) to update state through StateService
- Components now subscribe to StateService.users$ instead of UserService
- Verify all features still work

SUBTASK 8C: Add Loading & Error States
- When fetching users, call setLoading(true), then setLoading(false)
- Display loading spinner when loading$ is true
- When error occurs, call setError(message)
- Display error message when error$ has a value
- Implement error clearing when user dismisses message

SUBTASK 8D: Implement Async Operations
- Simulate API call delay with setTimeout or RxJS delay operator
- Show loading spinner during "API call"
- Handle errors gracefully
- Understand how state flows: loading -> data -> error states

VERIFICATION: By end of this task, you should understand:
- Centralized state management pattern
- BehaviorSubject for managing state
- Loading and error state handling
- How services manage app state vs component state

---

### TASK 9: Change Detection & Performance (90 min)

SUBTASK 9A: Understand Default Change Detection
- Create a list of 100+ users
- Add method to component that runs expensive computation
- Observe that every change detection cycle runs this
- Understand that Angular checks all components by default

SUBTASK 9B: Implement OnPush Change Detection
- Add `changeDetection: ChangeDetectionStrategy.OnPush` to list component
- Component only updates when @Input changes or events fire
- Test that it works correctly with immutable updates
- Understand performance improvement

SUBTASK 9C: Implement trackBy in ngFor
- Without trackBy: when list updates, Angular re-creates all DOM elements
- Add trackBy function to ngFor
- trackBy should return unique identifier per item
- Verify this improves performance with large lists

SUBTASK 9D: Lazy Load Modules (If using feature modules)
- Create a feature module for admin section
- Set up lazy loading in routes: `path: 'admin', loadComponent: () => import(...)`
- Verify admin component is not loaded until user navigates there
- Understand this reduces initial bundle size

VERIFICATION: By end of this task, you should understand:
- Default change detection strategy
- OnPush strategy for optimization
- trackBy function for list optimization
- Lazy loading for bundle size optimization

---

## DAY 5: FINAL INTERVIEW PREP (3-4 hours)

### TASK 10: Polish & Interview Questions (90 min)

SUBTASK 10A: Add HTTP Interceptor
- Create HttpInterceptor for adding auth token to requests
- Intercept error responses and handle 401 by redirecting to login
- Add loading spinner that shows during all HTTP requests

SUBTASK 10B: Add Custom Pipes
- Create pipe to format user display (e.g., "Name (email)")
- Create pipe to filter users by role in template
- Use these pipes in user list template

SUBTASK 10C: Add Proper Error Handling
- All observable chains should have catchError
- Show user-friendly error messages
- Never let unhandled errors crash the app

SUBTASK 10D: Code Review Your App
- Check all subscriptions for memory leaks
- Use async pipe where possible
- Remove any manual subscribe calls if you can use async pipe
- Check all forms are Reactive (not template-driven)
- Verify all protected routes have guards

---

### TASK 11: Study Interview Questions (120 min)

For each question, write a short answer in a separate file. Then code an example in your app.

QUESTION SET 1: Core Concepts
1. Explain the 4 types of data binding. When would you use each?
2. What is dependency injection? Why use it instead of manual instantiation?
3. What's the difference between a component and a service?
4. How do you prevent memory leaks in Angular?

QUESTION SET 2: Observables & RxJS
5. Explain Observables. How are they different from Promises?
6. What does switchMap do? Give a real-world use case.
7. Why use async pipe instead of manual subscribe?
8. How do you handle errors in observable chains?

QUESTION SET 3: Forms & Routing
9. Reactive Forms vs Template-Driven Forms. When use each?
10. How do you validate forms? Custom validators?
11. Route parameters vs query parameters?
12. How do you implement role-based access control with route guards?

QUESTION SET 4: State & Performance
13. How do you share state between components?
14. Explain BehaviorSubject. When use it?
15. What is OnPush change detection? When would you use it?
16. Why implement trackBy in *ngFor?

QUESTION SET 5: Advanced
17. What is a custom directive? Create one.
18. What is a custom pipe? Create one.
19. How do you lazy load routes?
20. Interceptors for auth, error handling?

For each question, create a small example in your app that demonstrates the concept.

---

## IMPLEMENTATION CHECKLIST

### Day 1 Checklist
- [ ] Angular project created and running
- [ ] Data binding (all 4 types) working in template
- [ ] UserService created with methods
- [ ] Service injected into component
- [ ] Users displaying from service
- [ ] BehaviorSubject in UserService
- [ ] Async pipe displaying users
- [ ] Memory leak prevention implemented

### Day 2 Checklist
- [ ] Routing set up with 4+ routes
- [ ] Route parameters working (/user/:id)
- [ ] Search with debounceTime and switchMap
- [ ] Error handling with catchError
- [ ] Basic form component created

### Day 3 Checklist
- [ ] Reactive form validation complete
- [ ] Create user form working
- [ ] Edit user form working
- [ ] AuthService created
- [ ] AuthGuard protecting routes
- [ ] RoleGuard for admin routes
- [ ] Login/logout UI complete

### Day 4 Checklist
- [ ] StateService managing all app state
- [ ] Loading and error states displaying
- [ ] OnPush change detection implemented
- [ ] trackBy in *ngFor lists
- [ ] HTTP Interceptor for auth token

### Day 5 Checklist
- [ ] No memory leaks in app
- [ ] All errors handled gracefully
- [ ] All interview questions answered with code examples
- [ ] Code is clean and follows Angular best practices
- [ ] Can explain every concept in your own words

---

## KEY INTERVIEW ANSWERS (Write These Out)

1. **Dependency Injection:**
"Angular injects dependencies automatically via constructor parameters. Benefits: easy testing (inject mocks), singletons, loose coupling."

2. **Memory Leaks:**
"Three ways: 1) takeUntil pattern with destroy subject, 2) async pipe in template, 3) manual unsubscribe. Use async pipe when possible."

3. **switchMap:**
"switchMap switches to new observable and cancels previous one. Perfect for search: user types new term, old request is cancelled."

4. **OnPush Change Detection:**
"Only check component when @Input changes or events fire. Improves performance for lists. Requires immutable updates."

5. **Reactive Forms:**
"Form state in component (FormBuilder, FormGroup). Better for complex forms, easier to test. 90% of jobs use this."

6. **Route Guards:**
"CanActivate prevents access to route if condition fails. Implement canActivate method returning boolean or Observable<boolean>. Use for auth and RBAC."

7. **Services:**
"Reusable logic holder. With providedIn: 'root', it's a singleton. Components inject it in constructor and use its methods/observables."

8. **BehaviorSubject:**
"Observable that remembers last value. Use when you need current value. Call .next() to update, subscribe to get updates."

---

## PERFORMANCE TARGETS

- App should load in under 2 seconds
- User list should feel instant (< 100ms)
- Form submission should feel responsive
- No console errors or warnings
- No memory leaks when navigating between pages

---

## STRETCH GOALS (If you finish early)

1. Add sorting to user list (by name, email, role)
2. Add pagination or virtual scrolling for large lists
3. Add confirmation dialog before deleting user
4. Add unit tests for services
5. Add search highlight in results
6. Add export to CSV feature
7. Dark mode toggle
8. Store auth token in localStorage after login
9. Add breadcrumb navigation
10. Add loading skeleton UI instead of spinner
