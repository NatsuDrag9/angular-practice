import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, Observable, Subject } from 'rxjs';
import { User } from '../services/user.service';
import { StateService } from '../services/state.service';

const MOCK_USERS: User[] = [
  { id: 1, name: 'B. Alice Johnson', email: 'b.alice@example.com', role: 'admin' },
  { id: 2, name: 'B. Bob Smith', email: 'b.bob@example.com', role: 'editor' },
  { id: 3, name: 'B. Carol White', email: 'b.carol@example.com', role: 'viewer' },
];

@Component({
  selector: 'state-user-list',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './state-user-list.html',
})
export class StateUserList implements OnInit, OnDestroy {
  protected users$: Observable<User[]>;
  protected loading$: Observable<boolean>;
  protected error$: Observable<string | null>;

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

  constructor(private stateService: StateService) {
    this.users$ = this.stateService.users$;
    this.loading$ = this.stateService.loading$;
    this.error$ = this.stateService.error$;
  }

  ngOnInit() {
    this.loadUsers();
  }

  // 8D: simulate async API call with loading/error states
  private loadUsers() {
    this.stateService.setLoading(true);
    this.stateService.setError(null);
    setTimeout(() => {
      this.stateService.setUsers(MOCK_USERS);
      this.stateService.setLoading(false);
    }, 1000);
  }

  protected onSearch() {
    const lower = this.searchTerm.toLowerCase();
    this.searchResults$ = this.stateService.users$.pipe(
      map((users) =>
        users.filter(
          (u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
        )
      )
    );
  }

  protected onAdd() {
    if (!this.newName || !this.newEmail || !this.newRole) return;
    const current = this.stateService.getSnapshot().users;
    const nextId = Math.max(0, ...current.map((u) => u.id)) + 1;
    this.stateService.setUsers([...current, { id: nextId, name: this.newName, email: this.newEmail, role: this.newRole }]);
    this.newName = this.newEmail = this.newRole = '';
  }

  protected onDelete() {
    if (this.deleteId === null) return;
    const current = this.stateService.getSnapshot().users;
    this.stateService.setUsers(current.filter((u) => u.id !== this.deleteId));
    this.deleteId = null;
  }

  protected onUpdate() {
    if (this.updateId === null) return;
    const updates: Omit<Partial<User>, 'id'> = {};
    if (this.updateName) updates.name = this.updateName;
    if (this.updateEmail) updates.email = this.updateEmail;
    if (this.updateRole) updates.role = this.updateRole;
    const current = this.stateService.getSnapshot().users;
    this.stateService.setUsers(current.map((u) => (u.id === this.updateId ? { ...u, ...updates } : u)));
    this.updateId = null;
    this.updateName = this.updateEmail = this.updateRole = '';
  }

  protected onDismissError() {
    this.stateService.setError(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}