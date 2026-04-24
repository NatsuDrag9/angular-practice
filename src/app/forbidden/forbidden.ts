import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'forbidden',
  imports: [RouterLink],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h3>403 — Forbidden</h3>
      <p>You do not have permission to access this page. Admin role required.</p>
      <a [routerLink]="['/user-list']">← Back to User List</a>
    </div>
  `,
})
export class Forbidden {}