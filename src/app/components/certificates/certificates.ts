import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../layout/navbar';
import { FooterComponent } from '../layout/footer/footer';
import { Certificate } from '../../shared/types';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './certificates.html',
  styleUrls: ['./certificates.css']
})
export class CertificatesComponent implements OnInit {
  protected readonly ts = inject(TranslationService);
  protected readonly courseService = inject(CourseService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.courseService.syncCertificates();
  }

  get certificates(): Certificate[] {
    return this.courseService.certificates();
  }

  get studentName(): string {
    return this.auth.currentUser()?.name ?? 'Estudiante';
  }

  formatDate(ts: number): string {
    const d = new Date(ts);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      technology: '#1e3a5f',
      agriculture: '#16a34a',
      business: '#8a7a00'
    };
    return map[category] ?? '#1a1a1a';
  }

  getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
      technology: 'Tecnología Agrícola',
      agriculture: 'Agricultura Sostenible',
      business: 'Emprendimiento Rural'
    };
    return map[category] ?? category;
  }

  async downloadCertificate(cert: Certificate): Promise<void> {
    // Si estamos conectados y el certificado no es un ID ficticio local, intentar descargar desde el backend
    if (navigator.onLine && !this.auth.isGuest() && !cert.id.startsWith('cert_')) {
      try {
        const blob = await this.courseService.downloadCertificateFile(cert.id);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificado_${cert.courseTitle.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      } catch (e) {
        console.warn('Error al descargar certificado del servidor, usando generación local:', e);
      }
    }

    // Fallback/Generación local
    const content = `
RURAL-TECH EDUCA
========================================
CERTIFICADO DE FINALIZACIÓN
========================================

Se certifica que:
${cert.studentName}

Ha completado satisfactoriamente el curso:
${cert.courseTitle}

Área: ${this.getCategoryLabel(cert.category)}
Instructor: ${cert.instructor}
Fecha de emisión: ${this.formatDate(cert.issuedAt)}

ID de Certificado: ${cert.id}

========================================
Rural-Tech Educa — Educación sin Límites
soporte@ruraltech.org
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_${cert.courseTitle.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}
