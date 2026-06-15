import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { CourseService } from '../../services/course.service';
import { SyncService } from '../../services/sync.service';
import { NavbarComponent } from '../layout/navbar';
import { FooterComponent } from '../layout/footer/footer';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent {
  protected readonly ts = inject(TranslationService);
  protected readonly courseService = inject(CourseService);
  protected readonly sync = inject(SyncService);
  private readonly router = inject(Router);

  protected readonly deleteMessage = signal<string>('');
  protected readonly openMessage = signal<string>('');

  get usedPercent(): number {
    return (this.sync.usedSpace() / this.sync.maxSpace()) * 100;
  }

  get offlineCourses() {
    return this.courseService.courses().filter(c => c.downloaded);
  }

  formatDate(ts: number): string {
    const d = new Date(ts);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getFileTypeLabel(type: string): string {
    return type === 'pdf' ? this.ts.translate('library.type_pdf') : this.ts.translate('library.type_video');
  }

  getFileIcon(type: string): string {
    return type === 'pdf' ? '📄' : '🎬';
  }

  openFile(name: string): void {
    // Create a simple text file as a demo of real file opening
    const content = `Rural-Tech — ${name}\n\nEste archivo contiene el material del módulo descargado.\nEn la versión con backend completo, aquí se abriría el PDF o video real almacenado en el dispositivo.\n\nContenido offline disponible.\n© 2026 Rural-Tech Educa`;
    const mime = name.endsWith('.mp4') ? 'video/mp4' : 'text/plain;charset=utf-8';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const ext = name.endsWith('.mp4') ? '' : '.txt';
    const a = document.createElement('a');
    a.href = url;
    a.download = name + ext;
    a.target = '_blank';
    a.click();
    URL.revokeObjectURL(url);
    this.openMessage.set(this.ts.translate('library.opening') + ' ' + name + '...');
    setTimeout(() => this.openMessage.set(''), 3000);
  }

  deleteFile(fileName: string): void {
    this.courseService.deleteLocalFile(fileName);
    this.deleteMessage.set(this.ts.translate('library.deleted'));
    setTimeout(() => this.deleteMessage.set(''), 3000);
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }

  goToSync(): void {
    this.router.navigate(['/sync-status']);
  }
}
