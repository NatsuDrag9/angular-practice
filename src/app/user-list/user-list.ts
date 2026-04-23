import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'user-list',
  imports: [FormsModule],
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  protected users: ReturnType<UserService['getUsers']> = [];

  protected deleteId: number | null = null;
  protected updateId: number | null = null;
  protected updateName = '';
  protected updateEmail = '';
  protected updateRole = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getUsers();
    console.log('UserService.getUsers() called once:', this.users);
  }

  onDelete() {
    if (this.deleteId !== null) {
      this.userService.deleteUser(this.deleteId);
      this.deleteId = null;
    }

    console.log('UserService.getUsers() called delete:', this.users);
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

    console.log('UserService.getUsers() called update:', this.users);
  }
}
