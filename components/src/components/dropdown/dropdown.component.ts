import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef } from '@angular/core';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type DropdownSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'dsb-dropdown',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  template: `
    <div class="dropdown-field" [ngClass]="{ 'dropdown-error': hasError, 'dropdown-disabled': disabled }">
      <label *ngIf="label" [attr.for]="dropdownId" class="dropdown-label">{{ label }}</label>
      <div class="dropdown-wrap">
        <button
          [id]="dropdownId"
          type="button"
          class="dropdown-trigger"
          [ngClass]="['dropdown-' + size, open ? 'dropdown-trigger--open' : '']"
          [disabled]="disabled"
          [attr.aria-expanded]="open"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-invalid]="hasError || null"
          (click)="toggle()"
          (blur)="onTouched()"
        >
          <span class="dropdown-value" [ngClass]="{ 'dropdown-placeholder': !selectedLabel }">
            {{ selectedLabel || placeholder }}
          </span>
          <svg class="dropdown-arrow" [ngClass]="{ 'dropdown-arrow--open': open }" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <ul *ngIf="open" class="dropdown-menu" role="listbox" [attr.aria-label]="label || placeholder">
          <li
            *ngFor="let option of options"
            class="dropdown-option"
            [ngClass]="{ 'dropdown-option--selected': value === option.value, 'dropdown-option--disabled': option.disabled }"
            role="option"
            [attr.aria-selected]="value === option.value"
            [attr.aria-disabled]="option.disabled || null"
            (click)="select(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
      <p *ngIf="hasError && errorMessage" class="dropdown-error-msg">{{ errorMessage }}</p>
      <p *ngIf="hint && !hasError" class="dropdown-hint">{{ hint }}</p>
    </div>
  `,
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements ControlValueAccessor {
  private static idCounter = 0;

  @Input() options: DropdownOption[] = [];
  @Input() label = '';
  @Input() placeholder = 'Select an option';
  @Input() size: DropdownSize = 'md';
  @Input() disabled = false;
  @Input() hasError = false;
  @Input() errorMessage = '';
  @Input() hint = '';
  @Input() dropdownId = `dsb-dropdown-${++DropdownComponent.idCounter}`;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  open = false;

  onTouched: () => void = () => {};
  private onChange: (v: string) => void = () => {};

  constructor(private elRef: ElementRef) {}

  get selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? '';
  }

  toggle(): void {
    this.open = !this.open;
  }

  select(option: DropdownOption): void {
    if (option.disabled) return;
    this.value = option.value;
    this.open = false;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void { this.open = false; }

  writeValue(val: string): void { this.value = val ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
}
