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

  /** Visible label rendered next to checkbox. */
  @Input() label = '';
  /** Current checked state. */
  @Input() checked = false;
  /** Disables interaction with the control. */
  @Input() disabled = false;
  /** Enables error style and semantics. */
  @Input() hasError = false;
  /** Error message displayed when hasError is true. */
  @Input() errorMessage = '';
  /** Helper text rendered when no error is active. */
  @Input() hint = '';
  /** Explicit checkbox id for input-label linking. */
  @Input() checkboxId = `dsb-checkbox-${++CheckboxComponent.idCounter}`;

  /** Emits checked state whenever it changes. */
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
