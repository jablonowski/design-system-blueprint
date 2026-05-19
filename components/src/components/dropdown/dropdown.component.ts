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
  templateUrl: './dropdown.component.html',
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
