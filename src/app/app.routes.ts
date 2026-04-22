import { Routes } from '@angular/router';
import { DataBinding } from './data-binding/data-binding';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'data-binding', component: DataBinding },
];
