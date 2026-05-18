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
  template: `
    <div *ngIf="open" class="modal-backdrop" (click)="onBackdropClick($event)" role="presentation">
      <div
        class="modal-panel"
        [ngClass]="'modal-' + size"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="title ? 'modal-title' : null"
      >
        <div class="modal-header">
          <h2 *ngIf="title" id="modal-title" class="modal-title">{{ title }}</h2>
          <div *ngIf="!title" class="modal-title-slot"><ng-content select="[modal-title]"></ng-content></div>
          <button
            class="modal-close"
            type="button"
            aria-label="Close modal"
            (click)="close()"
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="14" height="14">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <div class="modal-footer">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop = true;

  @Output() openChange = new EventEmitter<boolean>();
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
