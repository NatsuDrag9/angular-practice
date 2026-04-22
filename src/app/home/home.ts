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
  ];
}