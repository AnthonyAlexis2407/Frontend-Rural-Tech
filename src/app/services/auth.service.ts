import { Injectable, signal, computed } from '@angular/core';
import type { UserProfile, AuthResult } from '../shared/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSignal = signal<UserProfile | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isStudent = computed(() => this.currentUserSignal()?.role === 'student');
  readonly isTeacher = computed(() => this.currentUserSignal()?.role === 'teacher');

  private getStoredUser(): UserProfile | null {
    const userJson = localStorage.getItem('rt_user');
    const token = localStorage.getItem('rt_token');
    if (userJson && token) {
      try {
        return JSON.parse(userJson) as UserProfile;
      } catch {
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): AuthResult {
    if (!email || !password) {
      return { success: false, error: 'invalid' };
    }

    let name = 'Juan Pérez';
    let role: 'student' | 'teacher' = 'student';
    let location = 'Ayllu Patacancha';

    if (email.includes('docente') || email.includes('tecnico') || email.includes('profesor')) {
      name = 'Ing. David Condori';
      role = 'teacher';
      location = 'Cusco';
    }

    const mockUser: UserProfile = { name, email, location, role };
    const mockToken = 'mock-jwt-header.' + btoa(JSON.stringify(mockUser)) + '.mock-signature';

    localStorage.setItem('rt_user', JSON.stringify(mockUser));
    localStorage.setItem('rt_token', mockToken);

    this.currentUserSignal.set(mockUser);
    return { success: true };
  }

  register(name: string, email: string, location: string, role: 'student' | 'teacher', password: string): AuthResult {
    if (!name || !email || !role || !password) {
      return { success: false, error: 'invalid' };
    }

    const mockUser: UserProfile = { name, email, location, role };
    const mockToken = 'mock-jwt-header.' + btoa(JSON.stringify(mockUser)) + '.mock-signature';

    localStorage.setItem('rt_user', JSON.stringify(mockUser));
    localStorage.setItem('rt_token', mockToken);

    this.currentUserSignal.set(mockUser);
    return { success: true };
  }

  loginAsGuest(type: 'home' | 'login'): AuthResult {
    const guest = type === 'home'
      ? { name: 'Estudiante Rural (Invitado)', email: 'invitado@ruraltech.org', location: 'Comunidad Andina' }
      : { name: 'Usuario Invitado (Offline)', email: 'offline@ruraltech.org', location: 'Comunidad Local' };

    return this.register(guest.name, guest.email, guest.location, 'student', 'offline123');
  }

  updateProfile(name: string, email: string, location: string): void {
    const current = this.currentUserSignal();
    if (!current) return;

    const updated: UserProfile = { ...current, name, email, location };
    localStorage.setItem('rt_user', JSON.stringify(updated));
    this.currentUserSignal.set(updated);
  }

  logout(): void {
    localStorage.removeItem('rt_user');
    localStorage.removeItem('rt_token');
    this.currentUserSignal.set(null);
  }
}
