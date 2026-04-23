import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: boolean = false;

  logout() {
    this.isLoggedIn = false;
  }

  login() {
    this.isLoggedIn = true;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
}
