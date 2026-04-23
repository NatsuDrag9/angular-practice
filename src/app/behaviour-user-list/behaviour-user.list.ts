import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../services/user.service';
import { BehaviourUserService } from '../services/behaviour-user.service';

@Component({
  selector: 'behaviour-user-list',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './behaviour-user-list.html',
})
export class BehaviourUserList implements OnInit, OnDestroy {
  // 3B: manual subscription via takeUntil
  protected users: User[] = [];

  // 3D: observable reference — async pipe subscribes/unsubscribes in template
  protected users$!: Observable<User[]>;

  // 3E: search
  protected searchTerm = '';
  protected searchResults$: Observable<User[]> | null = null;

  protected newName = '';
  protected newEmail = '';
  protected newRole = '';
  protected deleteId: number | null = null;
  protected updateId: number | null = null;
  protected updateName = '';
  protected updateEmail = '';
  protected updateRole = '';

  private destroy$ = new Subject<void>();

  constructor(private userService: BehaviourUserService) {}

  ngOnInit() {
    // 3B
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        console.log('users$ emitted:', users);
      });

    // 3D: assign observable — template handles subscription via async pipe
    this.users$ = this.userService.getUsers();
  }

  protected onSearch() {
    this.searchResults$ = this.userService.searchUsers(this.searchTerm);
  }

  protected onAdd() {
    if (!this.newName || !this.newEmail || !this.newRole) return;
    const nextId = Math.max(0, ...this.users.map((u) => u.id)) + 1;
    this.userService.addUser({ id: nextId, name: this.newName, email: this.newEmail, role: this.newRole });
    this.newName = this.newEmail = this.newRole = '';
  }

  protected onDelete() {
    if (this.deleteId === null) return;
    this.userService.deleteUser(this.deleteId);
    this.deleteId = null;
  }

  protected onUpdate() {
    if (this.updateId === null) return;
    const updates: Omit<Partial<User>, 'id'> = {};
    if (this.updateName) updates.name = this.updateName;
    if (this.updateEmail) updates.email = this.updateEmail;
    if (this.updateRole) updates.role = this.updateRole;
    this.userService.updateUser(this.updateId, updates);
    this.updateId = null;
    this.updateName = this.updateEmail = this.updateRole = '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
