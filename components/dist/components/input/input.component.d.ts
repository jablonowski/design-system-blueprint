import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export declare class InputComponent implements ControlValueAccessor {
    private static idCounter;
    label: string;
    type: InputType;
    placeholder: string;
    size: InputSize;
    hasError: boolean;
    errorMessage: string;
    hint: string;
    disabled: boolean;
    inputId: string;
    valueChange: EventEmitter<string>;
    value: string;
    onTouched: () => void;
    private onChange;
    onInput(event: Event): void;
    writeValue(val: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(disabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InputComponent, "dsb-input", never, { "label": { "alias": "label"; "required": false; }; "type": { "alias": "type"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "size": { "alias": "size"; "required": false; }; "hasError": { "alias": "hasError"; "required": false; }; "errorMessage": { "alias": "errorMessage"; "required": false; }; "hint": { "alias": "hint"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}
