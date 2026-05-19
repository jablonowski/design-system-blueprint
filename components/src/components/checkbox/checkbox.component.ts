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
  templateUrl: './checkbox.component.html',
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
