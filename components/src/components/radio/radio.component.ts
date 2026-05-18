import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

@Component({
  selector: 'dsb-radio-group',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset class="radio-group" [ngClass]="{ 'radio-group-inline': inline }">
      <legend *ngIf="legend" class="radio-legend">{{ legend }}</legend>
      <div
        *ngFor="let option of options"
        class="radio-item"
        [ngClass]="{ 'radio-item--disabled': option.disabled || disabled }"
      >
        <label class="radio-root">
          <span
            class="radio-circle"
            [ngClass]="{ 'radio-circle--checked': value === option.value, 'radio-circle--error': hasError }"
          >
            <span *ngIf="value === option.value" class="radio-dot"></span>
          </span>
          <input
            class="radio-input"
            type="radio"
            [name]="groupName"
            [value]="option.value"
            [checked]="value === option.value"
            [disabled]="option.disabled || disabled"
            (change)="onSelect(option.value)"
            (blur)="onTouched()"
          />
          <span class="radio-label-wrap">
            <span class="radio-label">{{ option.label }}</span>
            <span *ngIf="option.hint" class="radio-hint">{{ option.hint }}</span>
          </span>
        </label>
      </div>
      <p *ngIf="hasError && errorMessage" class="radio-error">{{ errorMessage }}</p>
    </fieldset>
  `,
  styleUrls: ['./radio.component.css'],
})
export class RadioGroupComponent implements ControlValueAccessor {
  private static idCounter = 0;

  @Input() options: RadioOption[] = [];
  @Input() legend = '';
  @Input() disabled = false;
  @Input() hasError = false;
  @Input() errorMessage = '';
  @Input() inline = false;
  @Input() groupName = `dsb-radio-${++RadioGroupComponent.idCounter}`;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  onTouched: () => void = () => {};
  private onChange: (v: string) => void = () => {};

  onSelect(val: string): void {
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  writeValue(val: string): void { this.value = val ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
}
