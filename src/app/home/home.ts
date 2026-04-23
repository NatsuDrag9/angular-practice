import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly tasks = [
    { name: 'Data Binding', path: '/data-binding' },
    { name: 'User List (Services)', path: '/user-list' },
    { name: 'Authentication (Services)', path: '/auth' },
    { name: 'BehaviorSubject User List (Observables)', path: '/behaviour-user-list' },
    { name: 'RxJS Operators', path: '/rxjs-operators' },
  ];
}
