import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'dsb-modal',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnChanges {
  /** Controls dialog visibility state. */
  @Input() open = false;
  /** Visible title and default accessible label for the dialog. */
  @Input() title = '';
  /** Accessible label fallback when title is not provided. */
  @Input() ariaLabel = '';
  /** Max-width size variant. */
  @Input() size: ModalSize = 'md';
  /** Allows closing modal when backdrop is clicked. */
  @Input() closeOnBackdrop = true;

  /** Two-way binding companion event emitted when open changes to false. */
  @Output() openChange = new EventEmitter<boolean>();
  /** Emitted every time modal is closed. */
  @Output() closed = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  close(): void {
    this.open = false;
    document.body.style.overflow = '';
    this.openChange.emit(false);
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }
}
