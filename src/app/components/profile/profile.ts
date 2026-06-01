import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { CourseService } from '../../services/course.service';
import { NavbarComponent } from '../layout/navbar';
import { FooterComponent } from '../layout/footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  protected readonly auth = inject(AuthService);
  protected readonly ts = inject(TranslationService);
  protected readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly saveSuccess = signal(false);

  protected profileForm = this.fb.nonNullable.group({
    name: [this.auth.currentUser()?.name ?? '', Validators.required],
    email: [this.auth.currentUser()?.email ?? '', [Validators.required, Validators.email]],
    location: [this.auth.currentUser()?.location ?? '']
  });

  get userInitial(): string {
    return (this.auth.currentUser()?.name ?? 'U')[0];
  }

  get totalProgress(): number {
    const courses = this.courseService.courses();
    if (courses.length === 0) return 0;
    const total = courses.reduce((sum, c) => sum + c.progress, 0);
    return Math.round(total / courses.length);
  }

  get completedCourses(): number {
    return this.courseService.courses().filter(c => c.progress >= 100).length;
  }

  get totalStudyHours(): string {
    const total = this.courseService.courses().reduce((sum, c) => sum + c.progress, 0);
    return Math.round(total * 0.12) + 'h';
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const { name, email, location } = this.profileForm.getRawValue();
    this.auth.updateProfile(name, email, location);
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getRoleLabel(): string {
    const role = this.auth.currentUser()?.role ?? 'student';
    return role === 'teacher'
      ? this.ts.translate('auth.role_teacher')
      : this.ts.translate('auth.role_student');
  }
}
