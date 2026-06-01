import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { NavbarComponent } from '../layout/navbar';
import { FooterComponent } from '../layout/footer/footer';
import { CatalogCourse } from '../../shared/types';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class CoursesComponent {
  protected readonly ts = inject(TranslationService);
  protected readonly auth = inject(AuthService);
  protected readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  protected readonly activeFilter = signal<string>('all');

  protected readonly allCourses: CatalogCourse[] = [
    {
      id: 'drones',
      title: 'INTRODUCCIÓN A DRONES AGRÍCOLAS',
      description: 'Aprende a utilizar drones para monitoreo de cultivos, mapeo de terrenos y aplicación precisa de insumos.',
      category: 'technology',
      duration: '24h',
      modules: 6,
      level: 'courses.intermediate',
      instructor: 'Ing. David Condori',
      image: 'drones',
      color: '#1e3a5f',
      available: true
    },
    {
      id: 'riego',
      title: 'SISTEMAS DE RIEGO IOT',
      description: 'Diseña e implementa sistemas de riego inteligente con sensores IoT para optimizar el uso del agua.',
      category: 'technology',
      duration: '18h',
      modules: 4,
      level: 'courses.intermediate',
      instructor: 'María Quispe T.',
      image: 'riego',
      color: '#4f46e5',
      available: true
    },
    {
      id: 'suelos',
      title: 'ANÁLISIS DE SUELOS CON IA',
      description: 'Utiliza inteligencia artificial para clasificar nutrientes del suelo y recomendar cultivos óptimos.',
      category: 'technology',
      duration: '30h',
      modules: 8,
      level: 'courses.advanced',
      instructor: 'Dr. Hugo Mamani',
      image: 'suelos',
      color: '#7a1a1a',
      available: true
    },
    {
      id: 'emprendimiento',
      title: 'EMPRENDIMIENTO RURAL',
      description: 'Estrategias comerciales, finanzas básicas y creación de cooperativas para potenciar la economía local.',
      category: 'business',
      duration: '20h',
      modules: 5,
      level: 'courses.beginner',
      instructor: 'Lic. Elena Vargas',
      image: 'business',
      color: '#d4d0c9',
      available: true
    },
    {
      id: 'agroecologia',
      title: 'AGROECOLOGÍA SOSTENIBLE',
      description: 'Prácticas agrícolas sostenibles, conservación de suelos y biodiversidad para comunidades rurales.',
      category: 'agriculture',
      duration: '16h',
      modules: 4,
      level: 'courses.beginner',
      instructor: 'Téc. Juan Pérez',
      image: 'agro',
      color: '#16a34a',
      available: true
    },
    {
      id: 'certificacion',
      title: 'CERTIFICACIÓN ORGÁNICA',
      description: 'Procesos y normativas para obtener certificación orgánica de tus productos agrícolas.',
      category: 'agriculture',
      duration: '12h',
      modules: 3,
      level: 'courses.intermediate',
      instructor: 'Ing. Rosa Sarmiento',
      image: 'cert',
      color: '#8a7a00',
      available: false
    }
  ];

  get filteredCourses(): CatalogCourse[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.allCourses;
    return this.allCourses.filter(c => c.category === filter);
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  isCourseActive(courseId: string): boolean {
    return this.courseService.courses().some(c => c.id === courseId);
  }

  isCourseDownloaded(courseId: string): boolean {
    const course = this.courseService.courses().find(c => c.id === courseId);
    return course?.downloaded ?? false;
  }

  getCourseProgress(courseId: string): number {
    const course = this.courseService.courses().find(c => c.id === courseId);
    return course?.progress ?? 0;
  }

  getButtonLabel(course: CatalogCourse): string {
    return course.available
      ? this.ts.translate('courses.enroll')
      : this.ts.translate('courses.view');
  }

  enrollOrView(courseId: string): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
