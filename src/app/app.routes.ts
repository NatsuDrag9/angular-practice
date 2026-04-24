import { Routes } from '@angular/router';
import { DataBinding } from './data-binding/data-binding';
import { Home } from './home/home';
import { UserList } from './user-list/user-list';
import { Auth } from './auth/auth';
import { BehaviourUserList } from './behaviour-user-list/behaviour-user.list';
import { RxjsOperators } from './rxjs-operators/rxjs-operators';
import { UserDetail } from './user-detail/user-detail';
import { UserForm } from './user-form/user-form';
import { Forbidden } from './forbidden/forbidden';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // public routes
  { path: '', component: Home },
  { path: 'auth', component: Auth },
  { path: 'forbidden', component: Forbidden },

  // 7E: protected by AuthGuard — must be logged in
  { path: 'data-binding', component: DataBinding, canActivate: [authGuard] },
  { path: 'user-list', component: UserList, canActivate: [authGuard] },
  { path: 'user/:id', component: UserDetail, canActivate: [authGuard] },
  { path: 'behaviour-user-list', component: BehaviourUserList, canActivate: [authGuard] },
  { path: 'rxjs-operators', component: RxjsOperators, canActivate: [authGuard] },

  // 7E: protected by AuthGuard + RoleGuard — admin only
  { path: 'create-user', component: UserForm, canActivate: [authGuard, roleGuard] },
  { path: 'edit-user/:id', component: UserForm, canActivate: [authGuard, roleGuard] },
];