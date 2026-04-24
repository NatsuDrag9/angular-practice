import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  role: string;
}

// 7A: hardcoded credentials — one admin, one regular user
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 1, name: 'Alice (Admin)', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, name: 'John (Viewer)', username: 'john', password: 'user123', role: 'viewer' },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 7A: BehaviorSubject holds the currently logged-in user (null = logged out)
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);

  // 7A: public observables for components and guards to consume
  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isLoggedIn$ = this.currentUser$.pipe(map((user) => user !== null));

  // 7A: login() finds matching credentials and emits the user
  login(username: string, password: string): boolean {
    const match = MOCK_USERS.find((u) => u.username === username && u.password === password);
    if (match) {
      const { password: _pw, ...user } = match;
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  // 7A: logout() clears current user
  logout() {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.getValue()?.role === 'admin';
  }
}