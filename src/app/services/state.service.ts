import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from './user.service';
import { AuthUser } from './auth.service';

interface AppState {
  users: User[];
  currentUser: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: AppState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private appState = new BehaviorSubject<AppState>(INITIAL_STATE);

  readonly users$ = this.appState.pipe(map((s) => s.users));
  readonly currentUser$ = this.appState.pipe(map((s) => s.currentUser));
  readonly loading$ = this.appState.pipe(map((s) => s.loading));
  readonly error$ = this.appState.pipe(map((s) => s.error));

  setState(partial: Partial<AppState>) {
    this.appState.next({ ...this.appState.getValue(), ...partial });
  }

  setUsers(users: User[]) {
    this.setState({ users });
  }

  setCurrentUser(currentUser: AuthUser | null) {
    this.setState({ currentUser });
  }

  setLoading(loading: boolean) {
    this.setState({ loading });
  }

  setError(error: string | null) {
    this.setState({ error });
  }

  getSnapshot(): AppState {
    return this.appState.getValue();
  }
}