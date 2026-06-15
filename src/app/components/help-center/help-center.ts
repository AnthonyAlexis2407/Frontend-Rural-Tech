import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { NavbarComponent } from '../layout/navbar';
import { FooterComponent } from '../layout/footer/footer';

interface FaqItem {
  id: number;
  questionKey: string;
  answerKey: string;
  open: boolean;
}

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './help-center.html',
  styleUrls: ['./help-center.css']
})
export class HelpCenterComponent {
  protected readonly ts = inject(TranslationService);

  protected readonly downloadMessage = signal('');

  protected readonly faqItems = signal<FaqItem[]>([
    { id: 1, questionKey: 'help.faq1_q', answerKey: 'help.faq1_a', open: false },
    { id: 2, questionKey: 'help.faq2_q', answerKey: 'help.faq2_a', open: false },
    { id: 3, questionKey: 'help.faq3_q', answerKey: 'help.faq3_a', open: false },
    { id: 4, questionKey: 'help.faq4_q', answerKey: 'help.faq4_a', open: false },
    { id: 5, questionKey: 'help.faq5_q', answerKey: 'help.faq5_a', open: false },
  ]);

  toggleSymbol(item: FaqItem): string {
    return item.open ? '−' : '+';
  }

  downloadGuide(): void {
    const guideContent = `
RURAL-TECH — GUÍA COMPLETA DE USO
====================================

1. PRIMEROS PASOS
-----------------
Accede a Rural-Tech con tu correo y contraseña o en modo offline como invitado.
Si es tu primera vez, crea una cuenta gratuita con tu nombre, comunidad y rol.

2. DESCARGA DE CURSOS OFFLINE
------------------------------
Ve a Cursos > selecciona un curso > haz clic en "Descargar Offline".
Una vez descargado, accede desde Biblioteca Offline sin internet.

3. PROGRESO Y MÓDULOS
----------------------
Desde el Detalle del Curso accedes a todos los módulos. 
Márcalos como completados para avanzar y desbloquear módulos siguientes.

4. SINCRONIZACIÓN
-----------------
Ve a Estado de Sincronización para ver descargas y sincronizar tu progreso
cuando tengas conexión a internet.

5. CERTIFICADOS
---------------
Al completar todos los módulos de un curso recibirás un certificado digital
descargable desde la sección "Mis Certificados".

6. SOPORTE
----------
Email: soporte@ruraltech.org
Tel: +51 984 000 000

© 2026 Rural-Tech Educa
    `.trim();

    const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Guia_RuralTech.txt';
    a.click();
    URL.revokeObjectURL(url);

    this.downloadMessage.set(this.ts.translate('help.guide_downloading'));
    setTimeout(() => this.downloadMessage.set(''), 3000);
  }

  toggleFaq(id: number): void {
    this.faqItems.update(items =>
      items.map(item =>
        item.id === id ? { ...item, open: !item.open } : { ...item, open: false }
      )
    );
  }
}
