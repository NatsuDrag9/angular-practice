import { BehaviorSubject, map } from 'rxjs';
import { User } from './user.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BehaviourUserService {
  private users$ = new BehaviorSubject<User[]>([
    { id: 1, name: 'B. Alice Johnson', email: 'b.alice@example.com', role: 'admin' },
    { id: 2, name: 'B. Bob Smith', email: 'b.bob@example.com', role: 'editor' },
    { id: 3, name: 'B. Carol White', email: 'b.carol@example.com', role: 'viewer' },
  ]);

  getUsers() {
    return this.users$.asObservable();
  }

  addUser(item: User) {
    this.users$.next([...this.users$.getValue(), item]);
  }

  updateUser(id: number, updates: Omit<Partial<User>, 'id'>) {
    const current = this.users$.getValue();
    this.users$.next(current.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  deleteUser(id: number) {
    this.users$.next(this.users$.getValue().filter((item) => item.id !== id));
  }

  getUserById(id: number): User {
    return this.users$.getValue().find((item) => item.id === id)!;
  }

  searchUsers(term: string) {
    const lower = term.toLowerCase();
    return this.users$.pipe(
      map((users) => users.filter((u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)))
    );
  }
}