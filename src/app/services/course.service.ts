import { Injectable, signal, inject } from '@angular/core';
import { IndexedDbService, DownloadedFile } from './indexeddb.service';

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  progress: number; // percentage (0-100)
  downloaded: boolean;
  image: string;
  theme: 'yellow' | 'blue' | 'red' | 'grey';
}

export interface ActiveDownload {
  id: string;
  title: string;
  progress: number; // percentage (0-100)
  sizeDownloaded: string;
  sizeTotal: string;
  badge: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly db = inject(IndexedDbService);

  // Active courses list
  readonly courses = signal<Course[]>([
    {
      id: 'drones',
      title: 'INTRODUCCIÓN A DRONES AGRÍCOLAS',
      subtitle: 'Módulo 2: Sensores Multiespectrales',
      progress: 75,
      downloaded: false,
      image: 'drones.jpg',
      theme: 'yellow'
    },
    {
      id: 'riego',
      title: 'SISTEMAS DE RIEGO IOT',
      subtitle: 'Módulo 1: Sensores de Humedad',
      progress: 33,
      downloaded: true,
      image: 'riego.jpg',
      theme: 'blue'
    },
    {
      id: 'suelos',
      title: 'ANÁLISIS DE SUELOS CON IA',
      subtitle: 'Módulo 3: Clasificación de Nutrientes',
      progress: 80,
      downloaded: false,
      image: 'suelos.jpg',
      theme: 'red'
    }
  ]);

  // Downloads in progress listing (as shown in mockup)
  readonly downloadsInProgress = signal<ActiveDownload[]>([
    {
      id: 'soil_analytics',
      title: 'ADVANCED SOIL ANALYTICS',
      progress: 68,
      sizeDownloaded: '244MB',
      sizeTotal: '350MB',
      badge: 'URGENTE'
    },
    {
      id: 'irrigation_systems',
      title: 'IRRIGATION SYSTEMS',
      progress: 12,
      sizeDownloaded: '88MB',
      sizeTotal: '720MB',
      badge: 'MÓDULO 4'
    }
  ]);

  // Downloaded files listing
  readonly downloadedFiles = signal<DownloadedFile[]>([]);

  constructor() {
    this.loadDownloadedFiles();
  }

  async loadDownloadedFiles(): Promise<void> {
    let files = await this.db.getDownloadedFiles();
    if (files.length === 0) {
      // Load initial mock files as shown in mockup
      const mockFiles: DownloadedFile[] = [
        { name: 'Manual_Riego_V2.pdf', size: '4.5MB', type: 'pdf', downloadedAt: Date.now() },
        { name: 'Esquemas_Drone_X5.pdf', size: '12.1MB', type: 'pdf', downloadedAt: Date.now() },
        { name: 'Video_Calibracion_Sensores.mp4', size: '48.2MB', type: 'video', downloadedAt: Date.now() }
      ];
      for (const file of mockFiles) {
        await this.db.saveDownloadedFile(file);
      }
      files = mockFiles;
    }
    this.downloadedFiles.set(files);
  }

  /**
   * Simulates downloading a course
   */
  async startCourseDownload(courseId: string, title: string, totalSize: string): Promise<void> {
    // Check if already in progress
    const active = this.downloadsInProgress().find(d => d.id === courseId);
    if (active) return;

    const newDownload: ActiveDownload = {
      id: courseId,
      title: title.toUpperCase(),
      progress: 0,
      sizeDownloaded: '0MB',
      sizeTotal: totalSize,
      badge: 'DESCARGA'
    };

    this.downloadsInProgress.update(list => [...list, newDownload]);

    // Animate download simulation
    const interval = setInterval(() => {
      this.downloadsInProgress.update(list => {
        return list.map(item => {
          if (item.id === courseId) {
            const nextProgress = Math.min(item.progress + 15, 100);
            const sizeNum = parseFloat(totalSize);
            const sizeDownloaded = `${Math.round((nextProgress / 100) * sizeNum)}MB`;
            
            if (nextProgress === 100) {
              clearInterval(interval);
              // Complete download after timeout
              setTimeout(() => this.completeDownload(courseId, title), 300);
            }

            return { ...item, progress: nextProgress, sizeDownloaded };
          }
          return item;
        });
      });
    }, 1000);
  }

  private async completeDownload(courseId: string, title: string): Promise<void> {
    // Remove from active downloads
    this.downloadsInProgress.update(list => list.filter(item => item.id !== courseId));
    
    // Set course as downloaded
    this.courses.update(list => {
      return list.map(course => {
        if (course.id === courseId) {
          return { ...course, downloaded: true };
        }
        return course;
      });
    });

    // Save mock file to indexdb
    const fileName = `${title.replace(/\s+/g, '_')}_Offline.pdf`;
    const newFile: DownloadedFile = {
      name: fileName,
      size: '22.4MB',
      type: 'pdf',
      downloadedAt: Date.now()
    };
    await this.db.saveDownloadedFile(newFile);
    await this.loadDownloadedFiles();
  }

  /**
   * Deletes a downloaded course file from device
   */
  async deleteLocalFile(fileName: string): Promise<void> {
    await this.db.deleteDownloadedFile(fileName);
    await this.loadDownloadedFiles();
  }
}
