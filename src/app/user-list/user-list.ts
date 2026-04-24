import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'user-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit, OnDestroy {
  protected allUsers: User[] = [];
  protected users: User[] = [];
  protected activeRole: string | null = null;

  protected deleteId: number | null = null;
  protected updateId: number | null = null;
  protected updateName = '';
  protected updateEmail = '';
  protected updateRole = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.allUsers = this.userService.getUsers();

    // 5C: subscribe to queryParamMap so the list re-filters if the role param changes
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.activeRole = params.get('role');
      this.users = this.activeRole
        ? this.allUsers.filter((u) => u.role === this.activeRole)
        : this.allUsers;
    });
  }

  onDelete() {
    if (this.deleteId !== null) {
      this.userService.deleteUser(this.deleteId);
      this.deleteId = null;
    }
  }

  onUpdate() {
    if (this.updateId !== null) {
      const updates: Record<string, string> = {};
      if (this.updateName) updates['name'] = this.updateName;
      if (this.updateEmail) updates['email'] = this.updateEmail;
      if (this.updateRole) updates['role'] = this.updateRole;
      this.userService.updateUser(this.updateId, updates);
      this.updateId = null;
      this.updateName = '';
      this.updateEmail = '';
      this.updateRole = '';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
