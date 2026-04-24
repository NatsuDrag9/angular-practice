import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit, OnDestroy {
  protected user: User | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // 5B: subscribe to paramMap so the component reacts if the :id changes
    // without being destroyed (e.g. navigating from /user/1 to /user/2)
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = Number(params.get('id'));
      this.user = this.userService.getUserById(id) ?? null;
    });
  }

  protected goBack() {
    this.router.navigate(['/user-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
