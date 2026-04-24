import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit, OnDestroy {
  protected form!: FormGroup;
  protected isEditMode = false;
  protected successMessage: string | null = null;

  private editId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    // 6D: if :id param present, switch to edit mode and prefill form
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.editId = Number(id);
        const user = this.userService.getUserById(this.editId);
        if (user) {
          this.form.patchValue({ name: user.name, email: user.email, role: user.role });
        }
      }
    });
  }

  protected getControl(field: string) {
    return this.form.get(field)!;
  }

  // 6C / 6D: submit handler
  protected onSubmit() {
    if (this.form.invalid) return;

    const { name, email, role } = this.form.value;

    if (this.isEditMode && this.editId !== null) {
      this.userService.updateUser(this.editId, { name, email, role });
      this.successMessage = 'User updated successfully!';
    } else {
      const users = this.userService.getUsers();
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      this.userService.addUser({ id: newId, name, email, role });
      this.successMessage = 'User created successfully!';
    }

    this.form.reset();
    setTimeout(() => this.router.navigate(['/user-list']), 1500);
  }

  protected onCancel() {
    this.router.navigate(['/user-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}