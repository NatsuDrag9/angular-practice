import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../services/user.service';
import { BehaviourUserService } from '../services/behaviour-user.service';
import { catchError, debounceTime, map, of, Subject, switchMap, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'rxjs-operators',
  imports: [FormsModule],
  templateUrl: './rxjs-operators.html',
  styleUrl: './rxjs-operators.scss',
})
export class RxjsOperators implements OnInit, OnDestroy {
  protected users: User[] = [];
  protected userNames: string[] = [];
  protected adminNames: string[] = [];

  // 4C
  protected searchTerm = '';
  protected switchMapResults: User[] = [];
  private searchTerm$ = new Subject<string>();

  // 4D
  protected apiResults: User[] = [];
  protected apiError: string | null = null;
  protected shouldFail = false;

  // 4E
  protected debouncedSearchTerm = '';
  protected debouncedResults: User[] = [];
  private debouncedSearch$ = new Subject<string>();

  private destroy$ = new Subject<void>();

  constructor(private userService: BehaviourUserService) {}

  ngOnInit() {
    // 4A
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        console.log('users$ emitted:', users);
      });

    // 4C
    this.searchTerm$
      .pipe(
        switchMap((term) => this.userService.searchUsers(term)),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.switchMapResults = results;
        console.log('switchMap results:', results);
      });

    // 4E: debounceTime waits 300ms after the last keystroke before passing the
    // term to switchMap — avoids calling searchUsers on every single character
    this.debouncedSearch$
      .pipe(
        debounceTime(300),
        switchMap((term) => this.userService.searchUsers(term)),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.debouncedResults = results;
        console.log('debounced results:', results);
      });
  }

  protected mapUsers() {
    // 4A
    this.userService
      .getUsers()
      .pipe(
        map((users) => users.map((u) => u.name)),
        takeUntil(this.destroy$),
      )
      .subscribe((names) => {
        this.userNames = names;
        console.log('mapped names:', names);
      });
  }

  protected filterUsers() {
    // 4B
    this.userService
      .getUsers()
      .pipe(
        map((users) => users.filter((u) => u.role === 'admin')),
        map((admins) => admins.map((u) => u.name)),
        takeUntil(this.destroy$),
      )
      .subscribe((names) => {
        this.adminNames = names;
        console.log('admin names:', names);
      });
  }

  protected fetchUsers() {
    // 4D: fake API — throwError simulates a failed HTTP call
    const fakeApi$ = this.shouldFail
      ? throwError(() => new Error('API request failed (500)'))
      : this.userService.getUsers();

    this.apiError = null;
    fakeApi$
      .pipe(
        catchError((err: Error) => {
          // catchError intercepts the error, stores the message, and returns a
          // safe fallback so the stream completes instead of crashing
          this.apiError = err.message;
          return of([]);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((users) => {
        this.apiResults = users;
        console.log('4D api results:', users);
      });
  }

  protected onSearchInput() {
    // 4C
    this.searchTerm$.next(this.searchTerm);
  }

  protected onDebouncedSearchInput() {
    // 4E: push term into subject — debounceTime in the pipe delays the switchMap call
    this.debouncedSearch$.next(this.debouncedSearchTerm);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}