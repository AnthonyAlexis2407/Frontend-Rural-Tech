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
