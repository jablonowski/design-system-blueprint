import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'dsb-checkbox',
  standalone: true,
  imports: [NgClass, NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label
      class="checkbox-root"
      [ngClass]="{ 'checkbox-disabled': disabled, 'checkbox-checked': checked }"
    >
      <span class="checkbox-box" [ngClass]="{ 'checkbox-box--checked': checked, 'checkbox-box--error': hasError }">
        <svg *ngIf="checked" class="checkbox-icon" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <input
        class="checkbox-input"
        type="checkbox"
        [checked]="checked"
        [disabled]="disabled"
        [attr.aria-describedby]="hasError && errorMessage ? checkboxId + '-error' : null"
        [id]="checkboxId"
        (change)="onToggle($event)"
        (blur)="onTouched()"
      />
      <span *ngIf="label" class="checkbox-label">{{ label }}</span>
    </label>
    <p *ngIf="hasError && errorMessage" [id]="checkboxId + '-error'" class="checkbox-error">{{ errorMessage }}</p>
    <p *ngIf="hint && !hasError" class="checkbox-hint">{{ hint }}</p>
  `,
  styleUrls: ['./checkbox.component.css'],
})
export class CheckboxComponent implements ControlValueAccessor {
  private static idCounter = 0;

  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() hasError = false;
  @Input() errorMessage = '';
  @Input() hint = '';
  @Input() checkboxId = `dsb-checkbox-${++CheckboxComponent.idCounter}`;

  @Output() checkedChange = new EventEmitter<boolean>();

  onTouched: () => void = () => {};
  private onChange: (v: boolean) => void = () => {};

  onToggle(event: Event): void {
    const val = (event.target as HTMLInputElement).checked;
    this.checked = val;
    this.onChange(val);
    this.checkedChange.emit(val);
  }

  writeValue(val: boolean): void { this.checked = !!val; }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
}
