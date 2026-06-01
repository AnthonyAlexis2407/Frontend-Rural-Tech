import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { CourseService } from '../../services/course.service';
import { SyncService } from '../../services/sync.service';
import { NavbarComponent } from '../layout/navbar';
import { FooterComponent } from '../layout/footer/footer';
import { getProgressWidth } from '../../shared/utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
  protected readonly ts = inject(TranslationService);
  protected readonly courseService = inject(CourseService);
  protected readonly sync = inject(SyncService);
  protected readonly getProgressWidth = getProgressWidth;
  private readonly router = inject(Router);

  get onlineLabel(): string {
    return this.sync.isOnline()
      ? this.ts.translate('dash.mode_online')
      : this.ts.translate('dash.mode_offline');
  }

  get totalStudyHours(): string {
    const total = this.courseService.courses().reduce((sum, c) => sum + c.progress, 0);
    return Math.round(total * 0.12) + 'h';
  }

  get certificatesCount(): string {
    const count = this.courseService.courses().filter(c => c.progress >= 100).length;
    return count.toString().padStart(2, '0');
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
