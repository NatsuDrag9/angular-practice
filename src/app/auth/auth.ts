import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 7D: login page — username/password form
@Component({
  selector: 'auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  protected username = '';
  protected password = '';
  protected errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  protected onLogin() {
    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.errorMessage = null;
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }
}