import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'editor' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'viewer' },
  ];

  getUsers(): User[] {
    return this.users;
  }

  addUser(item: User) {
    this.users.push(item);
  }

  updateUser(id: number, updates: Omit<Partial<User>, 'id'>) {
    const matchedUser = this.users.find((item) => item.id === id);
    if (matchedUser) {
      Object.assign(matchedUser, updates);
    }
  }

  deleteUser(id: number) {
    this.users = this.users.filter((item) => item.id !== id);
  }

  getUserById(id: number): User {
    const itemIndex = this.users.findIndex((item) => item.id === id);
    return this.users[itemIndex];
  }
}
