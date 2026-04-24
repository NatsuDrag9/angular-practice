import { Routes } from '@angular/router';
import { DataBinding } from './data-binding/data-binding';
import { Home } from './home/home';
import { UserList } from './user-list/user-list';
import { Auth } from './auth/auth';
import { BehaviourUserList } from './behaviour-user-list/behaviour-user.list';
import { RxjsOperators } from './rxjs-operators/rxjs-operators';
import { UserDetail } from './user-detail/user-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'data-binding', component: DataBinding },
  { path: 'user-list', component: UserList },
  { path: 'user/:id', component: UserDetail },
  { path: 'auth', component: Auth },
  { path: 'behaviour-user-list', component: BehaviourUserList },
  { path: 'rxjs-operators', component: RxjsOperators },
];