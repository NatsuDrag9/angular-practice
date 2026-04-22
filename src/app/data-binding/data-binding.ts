import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'data-binding',
  imports: [FormsModule],
  templateUrl: './data-binding.html',
  styleUrl: './data-binding.scss',
})
export class DataBinding {
  protected userCount = 5;
  protected isLoading = false;
  protected searchTerm = '';

  incrementCount() {
    this.userCount += 1;
  }

  toggleIsLoading() {
    this.isLoading = !this.isLoading;
  }

  refreshUsers() {
    this.userCount = 0;
  }

  onSearchInput() {
    console.log(this.searchTerm);
  }
}