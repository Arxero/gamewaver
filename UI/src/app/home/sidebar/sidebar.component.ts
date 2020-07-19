import { Component, OnInit } from '@angular/core';
import { postCategories } from '../models/view/post-category';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  get categories() {
    return postCategories;
  }
  searchTerm: FormControl;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.searchTerm = new FormControl('');
  }

  navigate(category: string) {
    this.router.navigateByUrl(`search?filters=category!eq!${category}`);
  }

  onSubmit() {
    this.router.navigateByUrl(
      `search?filters=content!like!${this.searchTerm.value}`,
    );
  }
}
