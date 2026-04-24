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
    { name: 'RxJS Operators', path: '/rxjs-operators' },
    { name: 'Create User (Reactive Forms)', path: '/create-user' },
    { name: 'Performance Demo (OnPush + trackBy)', path: '/performance-demo' },
  ];

  protected readonly userListOptions = [
    { name: 'BehaviorSubject (Observables)', path: '/behaviour-user-list' },
    { name: 'State Management (StateService)', path: '/state-user-list' },
  ];

  protected showUserListPrompt = false;

  protected onUserListClick() {
    this.showUserListPrompt = !this.showUserListPrompt;
  }
}
