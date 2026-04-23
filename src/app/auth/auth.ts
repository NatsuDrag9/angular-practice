import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  protected showAuthenticatedContent: boolean = false;
  protected users: ReturnType<UserService['getUsers']> = [];

  constructor(private loginService: AuthService, private userService: UserService) {}

  onLoginClick() {
    this.loginService.login();
    this.showAuthenticatedContent = this.loginService.getIsLoggedIn();
    this.users = this.userService.getUsers();
  }

  onLogoutClick() {
    this.loginService.logout();
    this.showAuthenticatedContent = this.loginService.getIsLoggedIn();
    this.users = [];
  }
}