import * as i0 from '@angular/core';
import { EventEmitter, Output, Input, Component, forwardRef, HostListener, ContentChild, Directive, ContentChildren } from '@angular/core';
import { NgClass, NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

class ButtonComponent {
    variant = 'primary';
    size = 'md';
    disabled = false;
    loading = false;
    fullWidth = false;
    type = 'button';
    onClick = new EventEmitter();
    get classes() {
        return {
            btn: true,
            [`btn-${this.variant}`]: true,
            [`btn-${this.size}`]: true,
            'btn-full': this.fullWidth,
            'btn-loading': this.loading,
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: ButtonComponent, isStandalone: true, selector: "dsb-button", inputs: { variant: "variant", size: "size", disabled: "disabled", loading: "loading", fullWidth: "fullWidth", type: "type" }, outputs: { onClick: "onClick" }, ngImport: i0, template: "<button\n  [type]=\"type\"\n  [disabled]=\"disabled || loading\"\n  [ngClass]=\"classes\"\n  (click)=\"onClick.emit($event)\"\n>\n  <span *ngIf=\"loading\" class=\"spinner\" aria-hidden=\"true\"></span>\n  <ng-content></ng-content>\n</button>\n", styles: [".btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;font-weight:500;letter-spacing:.01em;border-radius:6px;border:1.5px solid transparent;cursor:pointer;transition:background .12s ease,border-color .12s ease,color .12s ease,opacity .12s ease;white-space:nowrap;text-decoration:none;outline:none;position:relative}.btn-sm{font-size:12px;padding:6px 12px;height:30px}.btn-md{font-size:14px;padding:8px 16px;height:36px}.btn-lg{font-size:15px;padding:10px 20px;height:44px}.btn-full{width:100%}.btn:focus-visible{outline:2px solid #0071e3;outline-offset:2px}.btn:disabled{opacity:.42;cursor:not-allowed;pointer-events:none}.btn-primary{background:#111;color:#fff;border-color:#111}.btn-primary:hover:not(:disabled){background:#333;border-color:#333}.btn-primary:active:not(:disabled){background:#000;border-color:#000}.btn-secondary{background:#fff;color:#111;border-color:#d4d4d4}.btn-secondary:hover:not(:disabled){background:#f5f5f5;border-color:#bbb}.btn-secondary:active:not(:disabled){background:#ebebeb}.btn-ghost{background:transparent;color:#555;border-color:transparent}.btn-ghost:hover:not(:disabled){background:#f5f5f5;color:#111}.btn-danger{background:#fff;color:#d93025;border-color:#f0a9a4}.btn-danger:hover:not(:disabled){background:#fef2f2;border-color:#d93025}.spinner{width:12px;height:12px;border:1.5px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0}@keyframes spin{to{transform:rotate(360deg)}}.btn-secondary:hover:not(:disabled){background:var(--color-surface);border-color:var(--color-text-main)}button:disabled{opacity:.5;cursor:not-allowed}button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-button', standalone: true, imports: [NgClass, NgIf], template: "<button\n  [type]=\"type\"\n  [disabled]=\"disabled || loading\"\n  [ngClass]=\"classes\"\n  (click)=\"onClick.emit($event)\"\n>\n  <span *ngIf=\"loading\" class=\"spinner\" aria-hidden=\"true\"></span>\n  <ng-content></ng-content>\n</button>\n", styles: [".btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;font-weight:500;letter-spacing:.01em;border-radius:6px;border:1.5px solid transparent;cursor:pointer;transition:background .12s ease,border-color .12s ease,color .12s ease,opacity .12s ease;white-space:nowrap;text-decoration:none;outline:none;position:relative}.btn-sm{font-size:12px;padding:6px 12px;height:30px}.btn-md{font-size:14px;padding:8px 16px;height:36px}.btn-lg{font-size:15px;padding:10px 20px;height:44px}.btn-full{width:100%}.btn:focus-visible{outline:2px solid #0071e3;outline-offset:2px}.btn:disabled{opacity:.42;cursor:not-allowed;pointer-events:none}.btn-primary{background:#111;color:#fff;border-color:#111}.btn-primary:hover:not(:disabled){background:#333;border-color:#333}.btn-primary:active:not(:disabled){background:#000;border-color:#000}.btn-secondary{background:#fff;color:#111;border-color:#d4d4d4}.btn-secondary:hover:not(:disabled){background:#f5f5f5;border-color:#bbb}.btn-secondary:active:not(:disabled){background:#ebebeb}.btn-ghost{background:transparent;color:#555;border-color:transparent}.btn-ghost:hover:not(:disabled){background:#f5f5f5;color:#111}.btn-danger{background:#fff;color:#d93025;border-color:#f0a9a4}.btn-danger:hover:not(:disabled){background:#fef2f2;border-color:#d93025}.spinner{width:12px;height:12px;border:1.5px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0}@keyframes spin{to{transform:rotate(360deg)}}.btn-secondary:hover:not(:disabled){background:var(--color-surface);border-color:var(--color-text-main)}button:disabled{opacity:.5;cursor:not-allowed}button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}\n"] }]
        }], propDecorators: { variant: [{
                type: Input
            }], size: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loading: [{
                type: Input
            }], fullWidth: [{
                type: Input
            }], type: [{
                type: Input
            }], onClick: [{
                type: Output
            }] } });

class InputComponent {
    static idCounter = 0;
    label = '';
    type = 'text';
    placeholder = '';
    size = 'md';
    hasError = false;
    errorMessage = '';
    hint = '';
    disabled = false;
    inputId = `dsb-input-${++InputComponent.idCounter}`;
    valueChange = new EventEmitter();
    value = '';
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTouched = () => { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = () => { };
    onInput(event) {
        const val = event.target.value;
        this.value = val;
        this.onChange(val);
        this.valueChange.emit(val);
    }
    writeValue(val) { this.value = val ?? ''; }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(disabled) { this.disabled = disabled; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: InputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: InputComponent, isStandalone: true, selector: "dsb-input", inputs: { label: "label", type: "type", placeholder: "placeholder", size: "size", hasError: "hasError", errorMessage: "errorMessage", hint: "hint", disabled: "disabled", inputId: "inputId" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => InputComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div class=\"field\" [ngClass]=\"{ 'field-error': hasError, 'field-disabled': disabled }\">\n  <label *ngIf=\"label\" [attr.for]=\"inputId\" class=\"label\">{{ label }}</label>\n  <div class=\"input-wrap\">\n    <input\n      [id]=\"inputId\"\n      [type]=\"type\"\n      [placeholder]=\"placeholder\"\n      [disabled]=\"disabled\"\n      [attr.aria-describedby]=\"hasError && errorMessage ? inputId + '-error' : null\"\n      [attr.aria-invalid]=\"hasError || null\"\n      class=\"input\"\n      [ngClass]=\"['input-' + size]\"\n      [value]=\"value\"\n      (input)=\"onInput($event)\"\n      (blur)=\"onTouched()\"\n    />\n  </div>\n  <p *ngIf=\"hasError && errorMessage\" [id]=\"inputId + '-error'\" class=\"error-msg\">\n    {{ errorMessage }}\n  </p>\n  <p *ngIf=\"hint && !hasError\" class=\"hint\">{{ hint }}</p>\n</div>\n", styles: [".field{display:flex;flex-direction:column;gap:5px}.label{font-size:13px;font-weight:500;color:#111;line-height:1.4}.input-wrap{position:relative;display:flex;align-items:center}.input{width:100%;font-family:inherit;color:#111;background:#fff;border:1.5px solid #d4d4d4;border-radius:6px;outline:none;transition:border-color .12s ease,box-shadow .12s ease;appearance:none;-webkit-appearance:none}.input-sm{font-size:12px;padding:5px 10px;height:30px}.input-md{font-size:14px;padding:7px 12px;height:36px}.input-lg{font-size:15px;padding:9px 14px;height:44px}.input::placeholder{color:#aaa}.input:focus{border-color:#111;box-shadow:0 0 0 3px #0000000f}.field-error .input{border-color:#d93025}.field-error .input:focus{box-shadow:0 0 0 3px #d930251a}.field-disabled .input{background:#f5f5f5;color:#999;cursor:not-allowed}.field-disabled .label{color:#999}.error-msg{font-size:12px;color:#d93025;margin:0;line-height:1.4}.hint{font-size:12px;color:#888;margin:0;line-height:1.4}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: InputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-input', standalone: true, imports: [NgClass, NgIf], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => InputComponent),
                            multi: true,
                        },
                    ], template: "<div class=\"field\" [ngClass]=\"{ 'field-error': hasError, 'field-disabled': disabled }\">\n  <label *ngIf=\"label\" [attr.for]=\"inputId\" class=\"label\">{{ label }}</label>\n  <div class=\"input-wrap\">\n    <input\n      [id]=\"inputId\"\n      [type]=\"type\"\n      [placeholder]=\"placeholder\"\n      [disabled]=\"disabled\"\n      [attr.aria-describedby]=\"hasError && errorMessage ? inputId + '-error' : null\"\n      [attr.aria-invalid]=\"hasError || null\"\n      class=\"input\"\n      [ngClass]=\"['input-' + size]\"\n      [value]=\"value\"\n      (input)=\"onInput($event)\"\n      (blur)=\"onTouched()\"\n    />\n  </div>\n  <p *ngIf=\"hasError && errorMessage\" [id]=\"inputId + '-error'\" class=\"error-msg\">\n    {{ errorMessage }}\n  </p>\n  <p *ngIf=\"hint && !hasError\" class=\"hint\">{{ hint }}</p>\n</div>\n", styles: [".field{display:flex;flex-direction:column;gap:5px}.label{font-size:13px;font-weight:500;color:#111;line-height:1.4}.input-wrap{position:relative;display:flex;align-items:center}.input{width:100%;font-family:inherit;color:#111;background:#fff;border:1.5px solid #d4d4d4;border-radius:6px;outline:none;transition:border-color .12s ease,box-shadow .12s ease;appearance:none;-webkit-appearance:none}.input-sm{font-size:12px;padding:5px 10px;height:30px}.input-md{font-size:14px;padding:7px 12px;height:36px}.input-lg{font-size:15px;padding:9px 14px;height:44px}.input::placeholder{color:#aaa}.input:focus{border-color:#111;box-shadow:0 0 0 3px #0000000f}.field-error .input{border-color:#d93025}.field-error .input:focus{box-shadow:0 0 0 3px #d930251a}.field-disabled .input{background:#f5f5f5;color:#999;cursor:not-allowed}.field-disabled .label{color:#999}.error-msg{font-size:12px;color:#d93025;margin:0;line-height:1.4}.hint{font-size:12px;color:#888;margin:0;line-height:1.4}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], type: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], size: [{
                type: Input
            }], hasError: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], hint: [{
                type: Input
            }], disabled: [{
                type: Input
            }], inputId: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class CheckboxComponent {
    static idCounter = 0;
    label = '';
    checked = false;
    disabled = false;
    hasError = false;
    errorMessage = '';
    hint = '';
    checkboxId = `dsb-checkbox-${++CheckboxComponent.idCounter}`;
    checkedChange = new EventEmitter();
    onTouched = () => { };
    onChange = () => { };
    onToggle(event) {
        const val = event.target.checked;
        this.checked = val;
        this.onChange(val);
        this.checkedChange.emit(val);
    }
    writeValue(val) { this.checked = !!val; }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(disabled) { this.disabled = disabled; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: CheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: CheckboxComponent, isStandalone: true, selector: "dsb-checkbox", inputs: { label: "label", checked: "checked", disabled: "disabled", hasError: "hasError", errorMessage: "errorMessage", hint: "hint", checkboxId: "checkboxId" }, outputs: { checkedChange: "checkedChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => CheckboxComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<label\n  class=\"checkbox-root\"\n  [ngClass]=\"{ 'checkbox-disabled': disabled, 'checkbox-checked': checked }\"\n>\n  <span class=\"checkbox-box\" [ngClass]=\"{ 'checkbox-box--checked': checked, 'checkbox-box--error': hasError }\">\n    <svg *ngIf=\"checked\" class=\"checkbox-icon\" viewBox=\"0 0 12 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n      <path d=\"M1 5l3.5 3.5L11 1\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  </span>\n  <input\n    class=\"checkbox-input\"\n    type=\"checkbox\"\n    [checked]=\"checked\"\n    [disabled]=\"disabled\"\n    [attr.aria-describedby]=\"hasError && errorMessage ? checkboxId + '-error' : null\"\n    [id]=\"checkboxId\"\n    (change)=\"onToggle($event)\"\n    (blur)=\"onTouched()\"\n  />\n  <span *ngIf=\"label\" class=\"checkbox-label\">{{ label }}</span>\n</label>\n<p *ngIf=\"hasError && errorMessage\" [id]=\"checkboxId + '-error'\" class=\"checkbox-error\">{{ errorMessage }}</p>\n<p *ngIf=\"hint && !hasError\" class=\"checkbox-hint\">{{ hint }}</p>\n", styles: [".checkbox-root{display:inline-flex;align-items:flex-start;gap:9px;cursor:pointer;-webkit-user-select:none;user-select:none;position:relative}.checkbox-input{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.checkbox-box{flex-shrink:0;width:16px;height:16px;border-radius:4px;border:1.5px solid #d4d4d4;background:#fff;display:flex;align-items:center;justify-content:center;transition:border-color .12s ease,background .12s ease,box-shadow .12s ease;margin-top:1px}.checkbox-root:hover:not(.checkbox-disabled) .checkbox-box{border-color:#111}.checkbox-root:focus-within .checkbox-box{outline:2px solid #111;outline-offset:2px}.checkbox-box--checked{background:#111;border-color:#111;color:#fff}.checkbox-box--error{border-color:#d93025}.checkbox-box--checked.checkbox-box--error{background:#d93025;border-color:#d93025}.checkbox-icon{width:12px;height:10px}.checkbox-label{font-size:14px;color:#111;line-height:1.5}.checkbox-disabled{cursor:not-allowed;opacity:.42}.checkbox-error{font-size:12px;color:#d93025;margin:5px 0 0 25px;line-height:1.4}.checkbox-hint{font-size:12px;color:#888;margin:5px 0 0 25px;line-height:1.4}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: CheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-checkbox', standalone: true, imports: [NgClass, NgIf], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CheckboxComponent),
                            multi: true,
                        },
                    ], template: "<label\n  class=\"checkbox-root\"\n  [ngClass]=\"{ 'checkbox-disabled': disabled, 'checkbox-checked': checked }\"\n>\n  <span class=\"checkbox-box\" [ngClass]=\"{ 'checkbox-box--checked': checked, 'checkbox-box--error': hasError }\">\n    <svg *ngIf=\"checked\" class=\"checkbox-icon\" viewBox=\"0 0 12 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n      <path d=\"M1 5l3.5 3.5L11 1\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  </span>\n  <input\n    class=\"checkbox-input\"\n    type=\"checkbox\"\n    [checked]=\"checked\"\n    [disabled]=\"disabled\"\n    [attr.aria-describedby]=\"hasError && errorMessage ? checkboxId + '-error' : null\"\n    [id]=\"checkboxId\"\n    (change)=\"onToggle($event)\"\n    (blur)=\"onTouched()\"\n  />\n  <span *ngIf=\"label\" class=\"checkbox-label\">{{ label }}</span>\n</label>\n<p *ngIf=\"hasError && errorMessage\" [id]=\"checkboxId + '-error'\" class=\"checkbox-error\">{{ errorMessage }}</p>\n<p *ngIf=\"hint && !hasError\" class=\"checkbox-hint\">{{ hint }}</p>\n", styles: [".checkbox-root{display:inline-flex;align-items:flex-start;gap:9px;cursor:pointer;-webkit-user-select:none;user-select:none;position:relative}.checkbox-input{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.checkbox-box{flex-shrink:0;width:16px;height:16px;border-radius:4px;border:1.5px solid #d4d4d4;background:#fff;display:flex;align-items:center;justify-content:center;transition:border-color .12s ease,background .12s ease,box-shadow .12s ease;margin-top:1px}.checkbox-root:hover:not(.checkbox-disabled) .checkbox-box{border-color:#111}.checkbox-root:focus-within .checkbox-box{outline:2px solid #111;outline-offset:2px}.checkbox-box--checked{background:#111;border-color:#111;color:#fff}.checkbox-box--error{border-color:#d93025}.checkbox-box--checked.checkbox-box--error{background:#d93025;border-color:#d93025}.checkbox-icon{width:12px;height:10px}.checkbox-label{font-size:14px;color:#111;line-height:1.5}.checkbox-disabled{cursor:not-allowed;opacity:.42}.checkbox-error{font-size:12px;color:#d93025;margin:5px 0 0 25px;line-height:1.4}.checkbox-hint{font-size:12px;color:#888;margin:5px 0 0 25px;line-height:1.4}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], checked: [{
                type: Input
            }], disabled: [{
                type: Input
            }], hasError: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], hint: [{
                type: Input
            }], checkboxId: [{
                type: Input
            }], checkedChange: [{
                type: Output
            }] } });

class RadioGroupComponent {
    static idCounter = 0;
    options = [];
    legend = '';
    disabled = false;
    hasError = false;
    errorMessage = '';
    inline = false;
    groupName = `dsb-radio-${++RadioGroupComponent.idCounter}`;
    valueChange = new EventEmitter();
    value = '';
    onTouched = () => { };
    onChange = () => { };
    onSelect(val) {
        this.value = val;
        this.onChange(val);
        this.valueChange.emit(val);
    }
    writeValue(val) { this.value = val ?? ''; }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(disabled) { this.disabled = disabled; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: RadioGroupComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: RadioGroupComponent, isStandalone: true, selector: "dsb-radio-group", inputs: { options: "options", legend: "legend", disabled: "disabled", hasError: "hasError", errorMessage: "errorMessage", inline: "inline", groupName: "groupName" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RadioGroupComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<fieldset class=\"radio-group\" [ngClass]=\"{ 'radio-group-inline': inline }\">\n  <legend *ngIf=\"legend\" class=\"radio-legend\">{{ legend }}</legend>\n  <div\n    *ngFor=\"let option of options\"\n    class=\"radio-item\"\n    [ngClass]=\"{ 'radio-item--disabled': option.disabled || disabled }\"\n  >\n    <label class=\"radio-root\">\n      <span\n        class=\"radio-circle\"\n        [ngClass]=\"{ 'radio-circle--checked': value === option.value, 'radio-circle--error': hasError }\"\n      >\n        <span *ngIf=\"value === option.value\" class=\"radio-dot\"></span>\n      </span>\n      <input\n        class=\"radio-input\"\n        type=\"radio\"\n        [name]=\"groupName\"\n        [value]=\"option.value\"\n        [checked]=\"value === option.value\"\n        [disabled]=\"option.disabled || disabled\"\n        (change)=\"onSelect(option.value)\"\n        (blur)=\"onTouched()\"\n      />\n      <span class=\"radio-label-wrap\">\n        <span class=\"radio-label\">{{ option.label }}</span>\n        <span *ngIf=\"option.hint\" class=\"radio-hint\">{{ option.hint }}</span>\n      </span>\n    </label>\n  </div>\n  <p *ngIf=\"hasError && errorMessage\" class=\"radio-error\">{{ errorMessage }}</p>\n</fieldset>\n", styles: [".radio-group{border:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.radio-group-inline{flex-direction:row;flex-wrap:wrap;gap:16px}.radio-legend{font-size:13px;font-weight:500;color:#111;margin-bottom:10px;float:left;width:100%}.radio-item{display:flex}.radio-item--disabled{opacity:.42;pointer-events:none}.radio-root{display:inline-flex;align-items:flex-start;gap:9px;cursor:pointer;-webkit-user-select:none;user-select:none;position:relative}.radio-input{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.radio-circle{flex-shrink:0;width:16px;height:16px;border-radius:50%;border:1.5px solid #d4d4d4;background:#fff;display:flex;align-items:center;justify-content:center;transition:border-color .12s ease,background .12s ease;margin-top:2px}.radio-root:hover .radio-circle{border-color:#111}.radio-root:focus-within .radio-circle{outline:2px solid #111;outline-offset:2px}.radio-circle--checked{border-color:#111;background:#fff}.radio-circle--error{border-color:#d93025}.radio-dot{width:7px;height:7px;border-radius:50%;background:#111}.radio-label-wrap{display:flex;flex-direction:column;gap:2px}.radio-label{font-size:14px;color:#111;line-height:1.5}.radio-hint{font-size:12px;color:#888;line-height:1.4}.radio-error{font-size:12px;color:#d93025;margin:4px 0 0;line-height:1.4}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: RadioGroupComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-radio-group', standalone: true, imports: [NgClass, NgIf, NgFor], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => RadioGroupComponent),
                            multi: true,
                        },
                    ], template: "<fieldset class=\"radio-group\" [ngClass]=\"{ 'radio-group-inline': inline }\">\n  <legend *ngIf=\"legend\" class=\"radio-legend\">{{ legend }}</legend>\n  <div\n    *ngFor=\"let option of options\"\n    class=\"radio-item\"\n    [ngClass]=\"{ 'radio-item--disabled': option.disabled || disabled }\"\n  >\n    <label class=\"radio-root\">\n      <span\n        class=\"radio-circle\"\n        [ngClass]=\"{ 'radio-circle--checked': value === option.value, 'radio-circle--error': hasError }\"\n      >\n        <span *ngIf=\"value === option.value\" class=\"radio-dot\"></span>\n      </span>\n      <input\n        class=\"radio-input\"\n        type=\"radio\"\n        [name]=\"groupName\"\n        [value]=\"option.value\"\n        [checked]=\"value === option.value\"\n        [disabled]=\"option.disabled || disabled\"\n        (change)=\"onSelect(option.value)\"\n        (blur)=\"onTouched()\"\n      />\n      <span class=\"radio-label-wrap\">\n        <span class=\"radio-label\">{{ option.label }}</span>\n        <span *ngIf=\"option.hint\" class=\"radio-hint\">{{ option.hint }}</span>\n      </span>\n    </label>\n  </div>\n  <p *ngIf=\"hasError && errorMessage\" class=\"radio-error\">{{ errorMessage }}</p>\n</fieldset>\n", styles: [".radio-group{border:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.radio-group-inline{flex-direction:row;flex-wrap:wrap;gap:16px}.radio-legend{font-size:13px;font-weight:500;color:#111;margin-bottom:10px;float:left;width:100%}.radio-item{display:flex}.radio-item--disabled{opacity:.42;pointer-events:none}.radio-root{display:inline-flex;align-items:flex-start;gap:9px;cursor:pointer;-webkit-user-select:none;user-select:none;position:relative}.radio-input{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.radio-circle{flex-shrink:0;width:16px;height:16px;border-radius:50%;border:1.5px solid #d4d4d4;background:#fff;display:flex;align-items:center;justify-content:center;transition:border-color .12s ease,background .12s ease;margin-top:2px}.radio-root:hover .radio-circle{border-color:#111}.radio-root:focus-within .radio-circle{outline:2px solid #111;outline-offset:2px}.radio-circle--checked{border-color:#111;background:#fff}.radio-circle--error{border-color:#d93025}.radio-dot{width:7px;height:7px;border-radius:50%;background:#111}.radio-label-wrap{display:flex;flex-direction:column;gap:2px}.radio-label{font-size:14px;color:#111;line-height:1.5}.radio-hint{font-size:12px;color:#888;line-height:1.4}.radio-error{font-size:12px;color:#d93025;margin:4px 0 0;line-height:1.4}\n"] }]
        }], propDecorators: { options: [{
                type: Input
            }], legend: [{
                type: Input
            }], disabled: [{
                type: Input
            }], hasError: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], inline: [{
                type: Input
            }], groupName: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class DropdownComponent {
    elRef;
    static idCounter = 0;
    options = [];
    label = '';
    placeholder = 'Select an option';
    size = 'md';
    disabled = false;
    hasError = false;
    errorMessage = '';
    hint = '';
    dropdownId = `dsb-dropdown-${++DropdownComponent.idCounter}`;
    valueChange = new EventEmitter();
    value = '';
    open = false;
    onTouched = () => { };
    onChange = () => { };
    constructor(elRef) {
        this.elRef = elRef;
    }
    get selectedLabel() {
        return this.options.find(o => o.value === this.value)?.label ?? '';
    }
    toggle() {
        this.open = !this.open;
    }
    select(option) {
        if (option.disabled)
            return;
        this.value = option.value;
        this.open = false;
        this.onChange(option.value);
        this.valueChange.emit(option.value);
    }
    onDocumentClick(event) {
        if (!this.elRef.nativeElement.contains(event.target)) {
            this.open = false;
        }
    }
    onEscape() { this.open = false; }
    writeValue(val) { this.value = val ?? ''; }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(disabled) { this.disabled = disabled; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: DropdownComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: DropdownComponent, isStandalone: true, selector: "dsb-dropdown", inputs: { options: "options", label: "label", placeholder: "placeholder", size: "size", disabled: "disabled", hasError: "hasError", errorMessage: "errorMessage", hint: "hint", dropdownId: "dropdownId" }, outputs: { valueChange: "valueChange" }, host: { listeners: { "document:click": "onDocumentClick($event)", "keydown.escape": "onEscape()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DropdownComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div class=\"dropdown-field\" [ngClass]=\"{ 'dropdown-error': hasError, 'dropdown-disabled': disabled }\">\n  <label *ngIf=\"label\" [attr.for]=\"dropdownId\" class=\"dropdown-label\">{{ label }}</label>\n  <div class=\"dropdown-wrap\">\n    <button\n      [id]=\"dropdownId\"\n      type=\"button\"\n      class=\"dropdown-trigger\"\n      [ngClass]=\"['dropdown-' + size, open ? 'dropdown-trigger--open' : '']\"\n      [disabled]=\"disabled\"\n      [attr.aria-expanded]=\"open\"\n      [attr.aria-haspopup]=\"'listbox'\"\n      [attr.aria-invalid]=\"hasError || null\"\n      (click)=\"toggle()\"\n      (blur)=\"onTouched()\"\n    >\n      <span class=\"dropdown-value\" [ngClass]=\"{ 'dropdown-placeholder': !selectedLabel }\">\n        {{ selectedLabel || placeholder }}\n      </span>\n      <svg class=\"dropdown-arrow\" [ngClass]=\"{ 'dropdown-arrow--open': open }\" viewBox=\"0 0 10 6\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n        <path d=\"M1 1l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    </button>\n    <ul *ngIf=\"open\" class=\"dropdown-menu\" role=\"listbox\" [attr.aria-label]=\"label || placeholder\">\n      <li\n        *ngFor=\"let option of options\"\n        class=\"dropdown-option\"\n        [ngClass]=\"{ 'dropdown-option--selected': value === option.value, 'dropdown-option--disabled': option.disabled }\"\n        role=\"option\"\n        [attr.aria-selected]=\"value === option.value\"\n        [attr.aria-disabled]=\"option.disabled || null\"\n        (click)=\"select(option)\"\n      >\n        {{ option.label }}\n      </li>\n    </ul>\n  </div>\n  <p *ngIf=\"hasError && errorMessage\" class=\"dropdown-error-msg\">{{ errorMessage }}</p>\n  <p *ngIf=\"hint && !hasError\" class=\"dropdown-hint\">{{ hint }}</p>\n</div>\n", styles: [".dropdown-field{display:flex;flex-direction:column;gap:5px}.dropdown-label{font-size:13px;font-weight:500;color:#111;line-height:1.4}.dropdown-wrap{position:relative}.dropdown-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;border:1.5px solid #d4d4d4;border-radius:6px;background:#fff;cursor:pointer;font-family:inherit;font-size:14px;color:#111;transition:border-color .12s ease,box-shadow .12s ease;text-align:left}.dropdown-trigger:hover:not(:disabled){border-color:#111}.dropdown-trigger:focus-visible{outline:2px solid #111;outline-offset:2px;border-color:#111}.dropdown-trigger--open{border-color:#111}.dropdown-trigger:disabled{cursor:not-allowed}.dropdown-sm{height:32px;padding:0 10px;font-size:13px}.dropdown-md{height:40px;padding:0 12px;font-size:14px}.dropdown-lg{height:48px;padding:0 14px;font-size:15px}.dropdown-value{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dropdown-placeholder{color:#a0a0a0}.dropdown-arrow{flex-shrink:0;width:10px;height:6px;color:#888;transition:transform .15s ease}.dropdown-arrow--open{transform:rotate(180deg)}.dropdown-menu{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:100;background:#fff;border:1.5px solid #d4d4d4;border-radius:6px;box-shadow:0 4px 12px #00000014;list-style:none;margin:0;padding:4px;max-height:240px;overflow-y:auto}.dropdown-option{padding:8px 10px;font-size:14px;color:#111;border-radius:4px;cursor:pointer;transition:background .1s ease}.dropdown-option:hover:not(.dropdown-option--disabled){background:#f5f5f5}.dropdown-option--selected{background:#f0f0f0;font-weight:500}.dropdown-option--disabled{color:#b0b0b0;cursor:not-allowed}.dropdown-error .dropdown-trigger{border-color:#d93025}.dropdown-error .dropdown-trigger:hover{border-color:#b0261e}.dropdown-disabled{opacity:.42;pointer-events:none}.dropdown-error-msg{font-size:12px;color:#d93025;margin:0;line-height:1.4}.dropdown-hint{font-size:12px;color:#888;margin:0;line-height:1.4}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: DropdownComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-dropdown', standalone: true, imports: [NgClass, NgIf, NgFor], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DropdownComponent),
                            multi: true,
                        },
                    ], template: "<div class=\"dropdown-field\" [ngClass]=\"{ 'dropdown-error': hasError, 'dropdown-disabled': disabled }\">\n  <label *ngIf=\"label\" [attr.for]=\"dropdownId\" class=\"dropdown-label\">{{ label }}</label>\n  <div class=\"dropdown-wrap\">\n    <button\n      [id]=\"dropdownId\"\n      type=\"button\"\n      class=\"dropdown-trigger\"\n      [ngClass]=\"['dropdown-' + size, open ? 'dropdown-trigger--open' : '']\"\n      [disabled]=\"disabled\"\n      [attr.aria-expanded]=\"open\"\n      [attr.aria-haspopup]=\"'listbox'\"\n      [attr.aria-invalid]=\"hasError || null\"\n      (click)=\"toggle()\"\n      (blur)=\"onTouched()\"\n    >\n      <span class=\"dropdown-value\" [ngClass]=\"{ 'dropdown-placeholder': !selectedLabel }\">\n        {{ selectedLabel || placeholder }}\n      </span>\n      <svg class=\"dropdown-arrow\" [ngClass]=\"{ 'dropdown-arrow--open': open }\" viewBox=\"0 0 10 6\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n        <path d=\"M1 1l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    </button>\n    <ul *ngIf=\"open\" class=\"dropdown-menu\" role=\"listbox\" [attr.aria-label]=\"label || placeholder\">\n      <li\n        *ngFor=\"let option of options\"\n        class=\"dropdown-option\"\n        [ngClass]=\"{ 'dropdown-option--selected': value === option.value, 'dropdown-option--disabled': option.disabled }\"\n        role=\"option\"\n        [attr.aria-selected]=\"value === option.value\"\n        [attr.aria-disabled]=\"option.disabled || null\"\n        (click)=\"select(option)\"\n      >\n        {{ option.label }}\n      </li>\n    </ul>\n  </div>\n  <p *ngIf=\"hasError && errorMessage\" class=\"dropdown-error-msg\">{{ errorMessage }}</p>\n  <p *ngIf=\"hint && !hasError\" class=\"dropdown-hint\">{{ hint }}</p>\n</div>\n", styles: [".dropdown-field{display:flex;flex-direction:column;gap:5px}.dropdown-label{font-size:13px;font-weight:500;color:#111;line-height:1.4}.dropdown-wrap{position:relative}.dropdown-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;border:1.5px solid #d4d4d4;border-radius:6px;background:#fff;cursor:pointer;font-family:inherit;font-size:14px;color:#111;transition:border-color .12s ease,box-shadow .12s ease;text-align:left}.dropdown-trigger:hover:not(:disabled){border-color:#111}.dropdown-trigger:focus-visible{outline:2px solid #111;outline-offset:2px;border-color:#111}.dropdown-trigger--open{border-color:#111}.dropdown-trigger:disabled{cursor:not-allowed}.dropdown-sm{height:32px;padding:0 10px;font-size:13px}.dropdown-md{height:40px;padding:0 12px;font-size:14px}.dropdown-lg{height:48px;padding:0 14px;font-size:15px}.dropdown-value{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dropdown-placeholder{color:#a0a0a0}.dropdown-arrow{flex-shrink:0;width:10px;height:6px;color:#888;transition:transform .15s ease}.dropdown-arrow--open{transform:rotate(180deg)}.dropdown-menu{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:100;background:#fff;border:1.5px solid #d4d4d4;border-radius:6px;box-shadow:0 4px 12px #00000014;list-style:none;margin:0;padding:4px;max-height:240px;overflow-y:auto}.dropdown-option{padding:8px 10px;font-size:14px;color:#111;border-radius:4px;cursor:pointer;transition:background .1s ease}.dropdown-option:hover:not(.dropdown-option--disabled){background:#f5f5f5}.dropdown-option--selected{background:#f0f0f0;font-weight:500}.dropdown-option--disabled{color:#b0b0b0;cursor:not-allowed}.dropdown-error .dropdown-trigger{border-color:#d93025}.dropdown-error .dropdown-trigger:hover{border-color:#b0261e}.dropdown-disabled{opacity:.42;pointer-events:none}.dropdown-error-msg{font-size:12px;color:#d93025;margin:0;line-height:1.4}.dropdown-hint{font-size:12px;color:#888;margin:0;line-height:1.4}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { options: [{
                type: Input
            }], label: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], size: [{
                type: Input
            }], disabled: [{
                type: Input
            }], hasError: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], hint: [{
                type: Input
            }], dropdownId: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], onDocumentClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }], onEscape: [{
                type: HostListener,
                args: ['keydown.escape']
            }] } });

class BreadcrumbsComponent {
    items = [];
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: BreadcrumbsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: BreadcrumbsComponent, isStandalone: true, selector: "dsb-breadcrumbs", inputs: { items: "items" }, ngImport: i0, template: "<nav aria-label=\"Breadcrumb\">\n  <ol class=\"breadcrumbs\">\n    <li *ngFor=\"let item of items; let last = last; let i = index\" class=\"breadcrumbs-item\">\n      <a\n        *ngIf=\"item.href && !last; else labelTpl\"\n        [href]=\"item.href\"\n        class=\"breadcrumbs-link\"\n      >{{ item.label }}</a>\n      <ng-template #labelTpl>\n        <span\n          class=\"breadcrumbs-current\"\n          [attr.aria-current]=\"last ? 'page' : null\"\n        >{{ item.label }}</span>\n      </ng-template>\n      <span *ngIf=\"!last\" class=\"breadcrumbs-sep\" aria-hidden=\"true\">\n        <svg viewBox=\"0 0 6 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" width=\"6\" height=\"10\">\n          <path d=\"M1 1l4 4-4 4\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </span>\n    </li>\n  </ol>\n</nav>\n", styles: [".breadcrumbs{list-style:none;margin:0;padding:0;display:flex;align-items:center;flex-wrap:wrap;gap:4px}.breadcrumbs-item{display:flex;align-items:center;gap:4px}.breadcrumbs-link{font-size:13px;color:#666;text-decoration:none;line-height:1.4;border-radius:3px;padding:1px 2px;transition:color .12s ease}.breadcrumbs-link:hover{color:#111;text-decoration:underline}.breadcrumbs-link:focus-visible{outline:2px solid #111;outline-offset:2px}.breadcrumbs-current{font-size:13px;color:#111;font-weight:500;line-height:1.4}.breadcrumbs-sep{display:flex;align-items:center;color:silver;margin:0 2px}\n"], dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: BreadcrumbsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-breadcrumbs', standalone: true, imports: [NgFor, NgIf], template: "<nav aria-label=\"Breadcrumb\">\n  <ol class=\"breadcrumbs\">\n    <li *ngFor=\"let item of items; let last = last; let i = index\" class=\"breadcrumbs-item\">\n      <a\n        *ngIf=\"item.href && !last; else labelTpl\"\n        [href]=\"item.href\"\n        class=\"breadcrumbs-link\"\n      >{{ item.label }}</a>\n      <ng-template #labelTpl>\n        <span\n          class=\"breadcrumbs-current\"\n          [attr.aria-current]=\"last ? 'page' : null\"\n        >{{ item.label }}</span>\n      </ng-template>\n      <span *ngIf=\"!last\" class=\"breadcrumbs-sep\" aria-hidden=\"true\">\n        <svg viewBox=\"0 0 6 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" width=\"6\" height=\"10\">\n          <path d=\"M1 1l4 4-4 4\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </span>\n    </li>\n  </ol>\n</nav>\n", styles: [".breadcrumbs{list-style:none;margin:0;padding:0;display:flex;align-items:center;flex-wrap:wrap;gap:4px}.breadcrumbs-item{display:flex;align-items:center;gap:4px}.breadcrumbs-link{font-size:13px;color:#666;text-decoration:none;line-height:1.4;border-radius:3px;padding:1px 2px;transition:color .12s ease}.breadcrumbs-link:hover{color:#111;text-decoration:underline}.breadcrumbs-link:focus-visible{outline:2px solid #111;outline-offset:2px}.breadcrumbs-current{font-size:13px;color:#111;font-weight:500;line-height:1.4}.breadcrumbs-sep{display:flex;align-items:center;color:silver;margin:0 2px}\n"] }]
        }], propDecorators: { items: [{
                type: Input
            }] } });

class HeaderComponent {
    brandName = 'Design System';
    logoSrc = '';
    logoAlt = 'Logo';
    logoHref = '/';
    navItems = [];
    ctaLabel = '';
    ctaHref = '#';
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: HeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: HeaderComponent, isStandalone: true, selector: "dsb-header", inputs: { brandName: "brandName", logoSrc: "logoSrc", logoAlt: "logoAlt", logoHref: "logoHref", navItems: "navItems", ctaLabel: "ctaLabel", ctaHref: "ctaHref" }, ngImport: i0, template: "<header class=\"header\">\n  <div class=\"header-inner\">\n    <a [href]=\"logoHref\" class=\"header-logo\" [attr.aria-label]=\"logoAlt\">\n      <svg *ngIf=\"!logoSrc\" class=\"header-logo-icon\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n        <rect width=\"28\" height=\"28\" rx=\"6\" fill=\"#111\"/>\n        <path d=\"M8 20V8h5.5a4.5 4.5 0 010 9H8m0 0h6\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n      <img *ngIf=\"logoSrc\" [src]=\"logoSrc\" [alt]=\"logoAlt\" class=\"header-logo-img\" />\n      <span *ngIf=\"brandName\" class=\"header-brand\">{{ brandName }}</span>\n    </a>\n\n    <nav *ngIf=\"navItems && navItems.length\" class=\"header-nav\" aria-label=\"Main navigation\">\n      <ul class=\"header-nav-list\">\n        <li *ngFor=\"let item of navItems\">\n          <a\n            [href]=\"item.href\"\n            class=\"header-nav-link\"\n            [class.header-nav-link--active]=\"item.active\"\n            [attr.aria-current]=\"item.active ? 'page' : null\"\n          >{{ item.label }}</a>\n        </li>\n      </ul>\n    </nav>\n\n    <div *ngIf=\"ctaLabel\" class=\"header-actions\">\n      <a [href]=\"ctaHref\" class=\"header-cta\">{{ ctaLabel }}</a>\n    </div>\n  </div>\n</header>\n", styles: [".header{width:100%;background:#fff;border-bottom:1px solid #ebebeb}.header-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;gap:32px}.header-logo{display:flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0;border-radius:4px}.header-logo:focus-visible{outline:2px solid #111;outline-offset:2px}.header-logo-icon{width:28px;height:28px}.header-logo-img{height:28px;width:auto;display:block}.header-brand{font-size:15px;font-weight:600;color:#111;letter-spacing:-.02em}.header-nav{flex:1}.header-nav-list{list-style:none;margin:0;padding:0;display:flex;align-items:center;gap:4px}.header-nav-link{display:inline-block;padding:5px 10px;font-size:14px;color:#555;text-decoration:none;border-radius:5px;transition:color .12s ease,background .12s ease}.header-nav-link:hover{color:#111;background:#f5f5f5}.header-nav-link--active{color:#111;font-weight:500}.header-nav-link:focus-visible{outline:2px solid #111;outline-offset:2px}.header-actions{margin-left:auto;flex-shrink:0}.header-cta{display:inline-block;padding:7px 16px;font-size:14px;font-weight:500;color:#fff;background:#111;border-radius:6px;text-decoration:none;transition:background .12s ease}.header-cta:hover{background:#333}.header-cta:focus-visible{outline:2px solid #111;outline-offset:3px}\n"], dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: HeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-header', standalone: true, imports: [NgFor, NgIf], template: "<header class=\"header\">\n  <div class=\"header-inner\">\n    <a [href]=\"logoHref\" class=\"header-logo\" [attr.aria-label]=\"logoAlt\">\n      <svg *ngIf=\"!logoSrc\" class=\"header-logo-icon\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n        <rect width=\"28\" height=\"28\" rx=\"6\" fill=\"#111\"/>\n        <path d=\"M8 20V8h5.5a4.5 4.5 0 010 9H8m0 0h6\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n      <img *ngIf=\"logoSrc\" [src]=\"logoSrc\" [alt]=\"logoAlt\" class=\"header-logo-img\" />\n      <span *ngIf=\"brandName\" class=\"header-brand\">{{ brandName }}</span>\n    </a>\n\n    <nav *ngIf=\"navItems && navItems.length\" class=\"header-nav\" aria-label=\"Main navigation\">\n      <ul class=\"header-nav-list\">\n        <li *ngFor=\"let item of navItems\">\n          <a\n            [href]=\"item.href\"\n            class=\"header-nav-link\"\n            [class.header-nav-link--active]=\"item.active\"\n            [attr.aria-current]=\"item.active ? 'page' : null\"\n          >{{ item.label }}</a>\n        </li>\n      </ul>\n    </nav>\n\n    <div *ngIf=\"ctaLabel\" class=\"header-actions\">\n      <a [href]=\"ctaHref\" class=\"header-cta\">{{ ctaLabel }}</a>\n    </div>\n  </div>\n</header>\n", styles: [".header{width:100%;background:#fff;border-bottom:1px solid #ebebeb}.header-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;gap:32px}.header-logo{display:flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0;border-radius:4px}.header-logo:focus-visible{outline:2px solid #111;outline-offset:2px}.header-logo-icon{width:28px;height:28px}.header-logo-img{height:28px;width:auto;display:block}.header-brand{font-size:15px;font-weight:600;color:#111;letter-spacing:-.02em}.header-nav{flex:1}.header-nav-list{list-style:none;margin:0;padding:0;display:flex;align-items:center;gap:4px}.header-nav-link{display:inline-block;padding:5px 10px;font-size:14px;color:#555;text-decoration:none;border-radius:5px;transition:color .12s ease,background .12s ease}.header-nav-link:hover{color:#111;background:#f5f5f5}.header-nav-link--active{color:#111;font-weight:500}.header-nav-link:focus-visible{outline:2px solid #111;outline-offset:2px}.header-actions{margin-left:auto;flex-shrink:0}.header-cta{display:inline-block;padding:7px 16px;font-size:14px;font-weight:500;color:#fff;background:#111;border-radius:6px;text-decoration:none;transition:background .12s ease}.header-cta:hover{background:#333}.header-cta:focus-visible{outline:2px solid #111;outline-offset:3px}\n"] }]
        }], propDecorators: { brandName: [{
                type: Input
            }], logoSrc: [{
                type: Input
            }], logoAlt: [{
                type: Input
            }], logoHref: [{
                type: Input
            }], navItems: [{
                type: Input
            }], ctaLabel: [{
                type: Input
            }], ctaHref: [{
                type: Input
            }] } });

class FooterComponent {
    brandName = 'Design System';
    logoSrc = '';
    logoHref = '/';
    tagline = '';
    columns = [];
    copyright = `© ${new Date().getFullYear()} Blueprint. All rights reserved.`;
    legalLinks = [];
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: FooterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: FooterComponent, isStandalone: true, selector: "dsb-footer", inputs: { brandName: "brandName", logoSrc: "logoSrc", logoHref: "logoHref", tagline: "tagline", columns: "columns", copyright: "copyright", legalLinks: "legalLinks" }, ngImport: i0, template: "<footer class=\"footer\">\n  <div class=\"footer-inner\">\n    <div class=\"footer-top\">\n      <div class=\"footer-brand\">\n        <a [href]=\"logoHref\" class=\"footer-logo-link\">\n          <svg *ngIf=\"!logoSrc\" class=\"footer-logo-icon\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n            <rect width=\"28\" height=\"28\" rx=\"6\" fill=\"#111\"/>\n            <path d=\"M8 20V8h5.5a4.5 4.5 0 010 9H8m0 0h6\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n          <img *ngIf=\"logoSrc\" [src]=\"logoSrc\" [alt]=\"brandName\" class=\"footer-logo-img\" />\n          <span class=\"footer-brand-name\">{{ brandName }}</span>\n        </a>\n        <p *ngIf=\"tagline\" class=\"footer-tagline\">{{ tagline }}</p>\n      </div>\n\n      <nav *ngIf=\"columns && columns.length\" class=\"footer-nav\" aria-label=\"Footer navigation\">\n        <div *ngFor=\"let col of columns\" class=\"footer-col\">\n          <h3 class=\"footer-col-heading\">{{ col.heading }}</h3>\n          <ul class=\"footer-col-list\">\n            <li *ngFor=\"let link of col.links\">\n              <a [href]=\"link.href\" class=\"footer-link\">{{ link.label }}</a>\n            </li>\n          </ul>\n        </div>\n      </nav>\n    </div>\n\n    <div class=\"footer-bottom\">\n      <p class=\"footer-copy\">{{ copyright }}</p>\n      <ul *ngIf=\"legalLinks && legalLinks.length\" class=\"footer-legal\">\n        <li *ngFor=\"let link of legalLinks\">\n          <a [href]=\"link.href\" class=\"footer-legal-link\">{{ link.label }}</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</footer>\n", styles: [".footer{width:100%;background:#fff;border-top:1px solid #ebebeb}.footer-inner{max-width:1200px;margin:0 auto;padding:48px 24px 24px}.footer-top{display:flex;gap:48px;margin-bottom:40px}.footer-brand{flex-shrink:0;min-width:180px}.footer-logo-link{display:inline-flex;align-items:center;gap:8px;text-decoration:none;border-radius:4px}.footer-logo-link:focus-visible{outline:2px solid #111;outline-offset:2px}.footer-logo-icon{width:26px;height:26px}.footer-logo-img{height:26px;width:auto;display:block}.footer-brand-name{font-size:15px;font-weight:600;color:#111;letter-spacing:-.02em}.footer-tagline{font-size:13px;color:#888;margin:10px 0 0;line-height:1.5;max-width:200px}.footer-nav{flex:1;display:flex;gap:32px;flex-wrap:wrap;justify-content:flex-end}.footer-col{min-width:120px}.footer-col-heading{font-size:12px;font-weight:600;color:#111;text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px}.footer-col-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.footer-link{font-size:13px;color:#666;text-decoration:none;border-radius:3px;transition:color .12s ease}.footer-link:hover{color:#111}.footer-link:focus-visible{outline:2px solid #111;outline-offset:2px}.footer-bottom{padding-top:20px;border-top:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}.footer-copy{font-size:12px;color:#aaa;margin:0}.footer-legal{list-style:none;margin:0;padding:0;display:flex;gap:16px}.footer-legal-link{font-size:12px;color:#aaa;text-decoration:none;transition:color .12s ease}.footer-legal-link:hover{color:#555}.footer-legal-link:focus-visible{outline:2px solid #111;outline-offset:2px}\n"], dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: FooterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-footer', standalone: true, imports: [NgFor, NgIf], template: "<footer class=\"footer\">\n  <div class=\"footer-inner\">\n    <div class=\"footer-top\">\n      <div class=\"footer-brand\">\n        <a [href]=\"logoHref\" class=\"footer-logo-link\">\n          <svg *ngIf=\"!logoSrc\" class=\"footer-logo-icon\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n            <rect width=\"28\" height=\"28\" rx=\"6\" fill=\"#111\"/>\n            <path d=\"M8 20V8h5.5a4.5 4.5 0 010 9H8m0 0h6\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n          <img *ngIf=\"logoSrc\" [src]=\"logoSrc\" [alt]=\"brandName\" class=\"footer-logo-img\" />\n          <span class=\"footer-brand-name\">{{ brandName }}</span>\n        </a>\n        <p *ngIf=\"tagline\" class=\"footer-tagline\">{{ tagline }}</p>\n      </div>\n\n      <nav *ngIf=\"columns && columns.length\" class=\"footer-nav\" aria-label=\"Footer navigation\">\n        <div *ngFor=\"let col of columns\" class=\"footer-col\">\n          <h3 class=\"footer-col-heading\">{{ col.heading }}</h3>\n          <ul class=\"footer-col-list\">\n            <li *ngFor=\"let link of col.links\">\n              <a [href]=\"link.href\" class=\"footer-link\">{{ link.label }}</a>\n            </li>\n          </ul>\n        </div>\n      </nav>\n    </div>\n\n    <div class=\"footer-bottom\">\n      <p class=\"footer-copy\">{{ copyright }}</p>\n      <ul *ngIf=\"legalLinks && legalLinks.length\" class=\"footer-legal\">\n        <li *ngFor=\"let link of legalLinks\">\n          <a [href]=\"link.href\" class=\"footer-legal-link\">{{ link.label }}</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</footer>\n", styles: [".footer{width:100%;background:#fff;border-top:1px solid #ebebeb}.footer-inner{max-width:1200px;margin:0 auto;padding:48px 24px 24px}.footer-top{display:flex;gap:48px;margin-bottom:40px}.footer-brand{flex-shrink:0;min-width:180px}.footer-logo-link{display:inline-flex;align-items:center;gap:8px;text-decoration:none;border-radius:4px}.footer-logo-link:focus-visible{outline:2px solid #111;outline-offset:2px}.footer-logo-icon{width:26px;height:26px}.footer-logo-img{height:26px;width:auto;display:block}.footer-brand-name{font-size:15px;font-weight:600;color:#111;letter-spacing:-.02em}.footer-tagline{font-size:13px;color:#888;margin:10px 0 0;line-height:1.5;max-width:200px}.footer-nav{flex:1;display:flex;gap:32px;flex-wrap:wrap;justify-content:flex-end}.footer-col{min-width:120px}.footer-col-heading{font-size:12px;font-weight:600;color:#111;text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px}.footer-col-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.footer-link{font-size:13px;color:#666;text-decoration:none;border-radius:3px;transition:color .12s ease}.footer-link:hover{color:#111}.footer-link:focus-visible{outline:2px solid #111;outline-offset:2px}.footer-bottom{padding-top:20px;border-top:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}.footer-copy{font-size:12px;color:#aaa;margin:0}.footer-legal{list-style:none;margin:0;padding:0;display:flex;gap:16px}.footer-legal-link{font-size:12px;color:#aaa;text-decoration:none;transition:color .12s ease}.footer-legal-link:hover{color:#555}.footer-legal-link:focus-visible{outline:2px solid #111;outline-offset:2px}\n"] }]
        }], propDecorators: { brandName: [{
                type: Input
            }], logoSrc: [{
                type: Input
            }], logoHref: [{
                type: Input
            }], tagline: [{
                type: Input
            }], columns: [{
                type: Input
            }], copyright: [{
                type: Input
            }], legalLinks: [{
                type: Input
            }] } });

class TagComponent {
    variant = 'default';
    size = 'md';
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: TagComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: TagComponent, isStandalone: true, selector: "dsb-tag", inputs: { variant: "variant", size: "size" }, ngImport: i0, template: "<span class=\"tag\" [ngClass]=\"['tag-' + variant, 'tag-' + size]\">\n  <ng-content></ng-content>\n</span>\n", styles: [".tag{display:inline-flex;align-items:center;font-family:inherit;font-weight:500;border-radius:4px;white-space:nowrap;letter-spacing:.01em}.tag-sm{font-size:11px;padding:2px 7px}.tag-md{font-size:12px;padding:3px 9px}.tag-default{background:#f0f0f0;color:#444}.tag-primary{background:#111;color:#fff}.tag-success{background:#e6f4ea;color:#1a7f3c}.tag-warning{background:#fef3cd;color:#92600a}.tag-danger{background:#fce8e6;color:#c5221f}.tag-info{background:#e8f0fe;color:#1a56db}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: TagComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-tag', standalone: true, imports: [NgClass], template: "<span class=\"tag\" [ngClass]=\"['tag-' + variant, 'tag-' + size]\">\n  <ng-content></ng-content>\n</span>\n", styles: [".tag{display:inline-flex;align-items:center;font-family:inherit;font-weight:500;border-radius:4px;white-space:nowrap;letter-spacing:.01em}.tag-sm{font-size:11px;padding:2px 7px}.tag-md{font-size:12px;padding:3px 9px}.tag-default{background:#f0f0f0;color:#444}.tag-primary{background:#111;color:#fff}.tag-success{background:#e6f4ea;color:#1a7f3c}.tag-warning{background:#fef3cd;color:#92600a}.tag-danger{background:#fce8e6;color:#c5221f}.tag-info{background:#e8f0fe;color:#1a56db}\n"] }]
        }], propDecorators: { variant: [{
                type: Input
            }], size: [{
                type: Input
            }] } });

class AvatarComponent {
    src = '';
    alt = '';
    name = '';
    size = 'md';
    shape = 'circle';
    get initials() {
        if (!this.name)
            return '?';
        const parts = this.name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: AvatarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: AvatarComponent, isStandalone: true, selector: "dsb-avatar", inputs: { src: "src", alt: "alt", name: "name", size: "size", shape: "shape" }, ngImport: i0, template: "<span\n  class=\"avatar\"\n  [ngClass]=\"['avatar-' + size, 'avatar-' + shape, src ? 'avatar-img' : 'avatar-initials']\"\n  [attr.aria-label]=\"alt || name || null\"\n  role=\"img\"\n>\n  <img *ngIf=\"src\" [src]=\"src\" [alt]=\"alt || name\" class=\"avatar-image\" />\n  <span *ngIf=\"!src\" class=\"avatar-text\">{{ initials }}</span>\n</span>\n", styles: [".avatar{display:inline-flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;background:#e8e8e8;font-family:inherit;font-weight:600;letter-spacing:.02em;color:#555;-webkit-user-select:none;user-select:none}.avatar-circle{border-radius:50%}.avatar-rounded{border-radius:6px}.avatar-xs{width:24px;height:24px;font-size:9px}.avatar-sm{width:32px;height:32px;font-size:12px}.avatar-md{width:40px;height:40px;font-size:14px}.avatar-lg{width:52px;height:52px;font-size:18px}.avatar-xl{width:68px;height:68px;font-size:22px}.avatar-image{width:100%;height:100%;object-fit:cover;display:block}.avatar-text{line-height:1}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: AvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-avatar', standalone: true, imports: [NgClass, NgIf], template: "<span\n  class=\"avatar\"\n  [ngClass]=\"['avatar-' + size, 'avatar-' + shape, src ? 'avatar-img' : 'avatar-initials']\"\n  [attr.aria-label]=\"alt || name || null\"\n  role=\"img\"\n>\n  <img *ngIf=\"src\" [src]=\"src\" [alt]=\"alt || name\" class=\"avatar-image\" />\n  <span *ngIf=\"!src\" class=\"avatar-text\">{{ initials }}</span>\n</span>\n", styles: [".avatar{display:inline-flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;background:#e8e8e8;font-family:inherit;font-weight:600;letter-spacing:.02em;color:#555;-webkit-user-select:none;user-select:none}.avatar-circle{border-radius:50%}.avatar-rounded{border-radius:6px}.avatar-xs{width:24px;height:24px;font-size:9px}.avatar-sm{width:32px;height:32px;font-size:12px}.avatar-md{width:40px;height:40px;font-size:14px}.avatar-lg{width:52px;height:52px;font-size:18px}.avatar-xl{width:68px;height:68px;font-size:22px}.avatar-image{width:100%;height:100%;object-fit:cover;display:block}.avatar-text{line-height:1}\n"] }]
        }], propDecorators: { src: [{
                type: Input
            }], alt: [{
                type: Input
            }], name: [{
                type: Input
            }], size: [{
                type: Input
            }], shape: [{
                type: Input
            }] } });

class ModalComponent {
    open = false;
    title = '';
    size = 'md';
    closeOnBackdrop = true;
    openChange = new EventEmitter();
    closed = new EventEmitter();
    ngOnChanges(changes) {
        if (changes['open']) {
            if (this.open) {
                document.body.style.overflow = 'hidden';
            }
            else {
                document.body.style.overflow = '';
            }
        }
    }
    close() {
        this.open = false;
        document.body.style.overflow = '';
        this.openChange.emit(false);
        this.closed.emit();
    }
    onBackdropClick(event) {
        if (this.closeOnBackdrop && event.target === event.currentTarget) {
            this.close();
        }
    }
    onEscape() {
        if (this.open)
            this.close();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ModalComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: ModalComponent, isStandalone: true, selector: "dsb-modal", inputs: { open: "open", title: "title", size: "size", closeOnBackdrop: "closeOnBackdrop" }, outputs: { openChange: "openChange", closed: "closed" }, host: { listeners: { "document:keydown.escape": "onEscape()" } }, usesOnChanges: true, ngImport: i0, template: "<div *ngIf=\"open\" class=\"modal-backdrop\" (click)=\"onBackdropClick($event)\" role=\"presentation\">\n  <div\n    class=\"modal-panel\"\n    [ngClass]=\"'modal-' + size\"\n    role=\"dialog\"\n    [attr.aria-modal]=\"true\"\n    [attr.aria-labelledby]=\"title ? 'modal-title' : null\"\n  >\n    <div class=\"modal-header\">\n      <h2 *ngIf=\"title\" id=\"modal-title\" class=\"modal-title\">{{ title }}</h2>\n      <div *ngIf=\"!title\" class=\"modal-title-slot\"><ng-content select=\"[modal-title]\"></ng-content></div>\n      <button\n        class=\"modal-close\"\n        type=\"button\"\n        aria-label=\"Close modal\"\n        (click)=\"close()\"\n      >\n        <svg viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" width=\"14\" height=\"14\">\n          <path d=\"M1 1l12 12M13 1L1 13\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>\n        </svg>\n      </button>\n    </div>\n\n    <div class=\"modal-body\">\n      <ng-content></ng-content>\n    </div>\n\n    <div class=\"modal-footer\">\n      <ng-content select=\"[modal-footer]\"></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [".modal-backdrop{position:fixed;inset:0;z-index:1000;background:#0006;display:flex;align-items:center;justify-content:center;padding:16px}.modal-panel{background:#fff;border-radius:10px;box-shadow:0 8px 32px #00000024;display:flex;flex-direction:column;max-height:calc(100vh - 64px);width:100%;animation:modal-in .16s ease}@keyframes modal-in{0%{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}.modal-sm{max-width:400px}.modal-md{max-width:540px}.modal-lg{max-width:720px}.modal-xl{max-width:960px}.modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px 20px 0;flex-shrink:0}.modal-title{font-size:16px;font-weight:600;color:#111;margin:0;line-height:1.4}.modal-title-slot{flex:1}.modal-close{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:28px;height:28px;border:none;background:transparent;color:#888;cursor:pointer;border-radius:5px;transition:background .12s ease,color .12s ease;padding:0;margin-top:-2px}.modal-close:hover{background:#f0f0f0;color:#111}.modal-close:focus-visible{outline:2px solid #111;outline-offset:2px}.modal-body{padding:16px 20px;overflow-y:auto;flex:1;font-size:14px;color:#333;line-height:1.6}.modal-footer{padding:0 20px 20px;flex-shrink:0;display:flex;justify-content:flex-end;gap:8px}.modal-footer:empty{display:none}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-modal', standalone: true, imports: [NgClass, NgIf], template: "<div *ngIf=\"open\" class=\"modal-backdrop\" (click)=\"onBackdropClick($event)\" role=\"presentation\">\n  <div\n    class=\"modal-panel\"\n    [ngClass]=\"'modal-' + size\"\n    role=\"dialog\"\n    [attr.aria-modal]=\"true\"\n    [attr.aria-labelledby]=\"title ? 'modal-title' : null\"\n  >\n    <div class=\"modal-header\">\n      <h2 *ngIf=\"title\" id=\"modal-title\" class=\"modal-title\">{{ title }}</h2>\n      <div *ngIf=\"!title\" class=\"modal-title-slot\"><ng-content select=\"[modal-title]\"></ng-content></div>\n      <button\n        class=\"modal-close\"\n        type=\"button\"\n        aria-label=\"Close modal\"\n        (click)=\"close()\"\n      >\n        <svg viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" width=\"14\" height=\"14\">\n          <path d=\"M1 1l12 12M13 1L1 13\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>\n        </svg>\n      </button>\n    </div>\n\n    <div class=\"modal-body\">\n      <ng-content></ng-content>\n    </div>\n\n    <div class=\"modal-footer\">\n      <ng-content select=\"[modal-footer]\"></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [".modal-backdrop{position:fixed;inset:0;z-index:1000;background:#0006;display:flex;align-items:center;justify-content:center;padding:16px}.modal-panel{background:#fff;border-radius:10px;box-shadow:0 8px 32px #00000024;display:flex;flex-direction:column;max-height:calc(100vh - 64px);width:100%;animation:modal-in .16s ease}@keyframes modal-in{0%{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}.modal-sm{max-width:400px}.modal-md{max-width:540px}.modal-lg{max-width:720px}.modal-xl{max-width:960px}.modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px 20px 0;flex-shrink:0}.modal-title{font-size:16px;font-weight:600;color:#111;margin:0;line-height:1.4}.modal-title-slot{flex:1}.modal-close{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:28px;height:28px;border:none;background:transparent;color:#888;cursor:pointer;border-radius:5px;transition:background .12s ease,color .12s ease;padding:0;margin-top:-2px}.modal-close:hover{background:#f0f0f0;color:#111}.modal-close:focus-visible{outline:2px solid #111;outline-offset:2px}.modal-body{padding:16px 20px;overflow-y:auto;flex:1;font-size:14px;color:#333;line-height:1.6}.modal-footer{padding:0 20px 20px;flex-shrink:0;display:flex;justify-content:flex-end;gap:8px}.modal-footer:empty{display:none}\n"] }]
        }], propDecorators: { open: [{
                type: Input
            }], title: [{
                type: Input
            }], size: [{
                type: Input
            }], closeOnBackdrop: [{
                type: Input
            }], openChange: [{
                type: Output
            }], closed: [{
                type: Output
            }], onEscape: [{
                type: HostListener,
                args: ['document:keydown.escape']
            }] } });

class ColumnDefDirective {
    key;
    header = '';
    width = '';
    align = 'left';
    cellTemplate;
    headerTemplate;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ColumnDefDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.22", type: ColumnDefDirective, isStandalone: true, selector: "dsb-column", inputs: { key: "key", header: "header", width: "width", align: "align" }, queries: [{ propertyName: "cellTemplate", first: true, predicate: ["cell"], descendants: true }, { propertyName: "headerTemplate", first: true, predicate: ["headerCell"], descendants: true }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ColumnDefDirective, decorators: [{
            type: Directive,
            args: [{ selector: 'dsb-column', standalone: true }]
        }], propDecorators: { key: [{
                type: Input,
                args: [{ required: true }]
            }], header: [{
                type: Input
            }], width: [{
                type: Input
            }], align: [{
                type: Input
            }], cellTemplate: [{
                type: ContentChild,
                args: ['cell']
            }], headerTemplate: [{
                type: ContentChild,
                args: ['headerCell']
            }] } });

class TableComponent {
    rows = [];
    striped = false;
    hoverable = true;
    loading = false;
    rowClickable = false;
    emptyMessage = 'No data to display.';
    rowClick = new EventEmitter();
    columnDefs;
    columns = [];
    ngAfterContentInit() {
        this.columns = this.columnDefs.toArray();
        this.columnDefs.changes.subscribe(() => {
            this.columns = this.columnDefs.toArray();
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: TableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: TableComponent, isStandalone: true, selector: "dsb-table", inputs: { rows: "rows", striped: "striped", hoverable: "hoverable", loading: "loading", rowClickable: "rowClickable", emptyMessage: "emptyMessage" }, outputs: { rowClick: "rowClick" }, queries: [{ propertyName: "columnDefs", predicate: ColumnDefDirective }], ngImport: i0, template: "<div class=\"table-wrap\">\n  <table class=\"table\" [ngClass]=\"{ 'table-striped': striped, 'table-hoverable': hoverable }\">\n    <thead class=\"table-head\">\n      <tr>\n        <th\n          *ngFor=\"let col of columns\"\n          class=\"table-th\"\n          [style.width]=\"col.width || null\"\n          [ngClass]=\"'align-' + col.align\"\n        >\n          <ng-container *ngIf=\"col.headerTemplate; else defaultHeader\">\n            <ng-container [ngTemplateOutlet]=\"col.headerTemplate\"></ng-container>\n          </ng-container>\n          <ng-template #defaultHeader>{{ col.header }}</ng-template>\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngIf=\"loading\">\n        <td [attr.colspan]=\"columns.length\" class=\"table-td table-td-state\">\n          <span class=\"table-spinner\" aria-hidden=\"true\"></span>\n          <span class=\"sr-only\">Loading\u2026</span>\n        </td>\n      </tr>\n      <tr *ngIf=\"!loading && rows.length === 0\">\n        <td [attr.colspan]=\"columns.length\" class=\"table-td table-td-state\">\n          {{ emptyMessage }}\n        </td>\n      </tr>\n      <tr\n        *ngFor=\"let row of rows; let i = index\"\n        class=\"table-row\"\n        [ngClass]=\"{ 'table-row-clickable': rowClickable }\"\n        (click)=\"rowClick.emit(row)\"\n      >\n        <td\n          *ngFor=\"let col of columns\"\n          class=\"table-td\"\n          [ngClass]=\"'align-' + col.align\"\n        >\n          <ng-container\n            *ngIf=\"col.cellTemplate; else defaultCell\"\n            [ngTemplateOutlet]=\"col.cellTemplate\"\n            [ngTemplateOutletContext]=\"{ $implicit: row[col.key], row: row, index: i }\"\n          ></ng-container>\n          <ng-template #defaultCell>{{ row[col.key] }}</ng-template>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n", styles: [".table-wrap{width:100%;overflow-x:auto;border:1.5px solid #ebebeb;border-radius:8px;background:#fff}.table{width:100%;border-collapse:collapse;font-size:14px;color:#111}.table-head{border-bottom:1.5px solid #ebebeb}.table-th{padding:10px 16px;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.06em;background:#fafafa;white-space:nowrap}.table-td{padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:middle;color:#333;font-size:14px;line-height:1.5}.table-row:last-child .table-td{border-bottom:none}.align-left{text-align:left}.align-center{text-align:center}.align-right{text-align:right}.table-striped .table-row:nth-child(2n) .table-td{background:#fafafa}.table-hoverable .table-row:hover .table-td{background:#f7f7f7;transition:background .1s ease}.table-row-clickable{cursor:pointer}.table-td-state{text-align:center;color:#aaa;padding:40px 16px;font-size:14px}.table-spinner{display:inline-block;width:18px;height:18px;border:2px solid #e0e0e0;border-top-color:#111;border-radius:50%;animation:table-spin .7s linear infinite}@keyframes table-spin{to{transform:rotate(360deg)}}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}\n"], dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: TableComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-table', standalone: true, imports: [NgFor, NgIf, NgClass, NgTemplateOutlet], template: "<div class=\"table-wrap\">\n  <table class=\"table\" [ngClass]=\"{ 'table-striped': striped, 'table-hoverable': hoverable }\">\n    <thead class=\"table-head\">\n      <tr>\n        <th\n          *ngFor=\"let col of columns\"\n          class=\"table-th\"\n          [style.width]=\"col.width || null\"\n          [ngClass]=\"'align-' + col.align\"\n        >\n          <ng-container *ngIf=\"col.headerTemplate; else defaultHeader\">\n            <ng-container [ngTemplateOutlet]=\"col.headerTemplate\"></ng-container>\n          </ng-container>\n          <ng-template #defaultHeader>{{ col.header }}</ng-template>\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngIf=\"loading\">\n        <td [attr.colspan]=\"columns.length\" class=\"table-td table-td-state\">\n          <span class=\"table-spinner\" aria-hidden=\"true\"></span>\n          <span class=\"sr-only\">Loading\u2026</span>\n        </td>\n      </tr>\n      <tr *ngIf=\"!loading && rows.length === 0\">\n        <td [attr.colspan]=\"columns.length\" class=\"table-td table-td-state\">\n          {{ emptyMessage }}\n        </td>\n      </tr>\n      <tr\n        *ngFor=\"let row of rows; let i = index\"\n        class=\"table-row\"\n        [ngClass]=\"{ 'table-row-clickable': rowClickable }\"\n        (click)=\"rowClick.emit(row)\"\n      >\n        <td\n          *ngFor=\"let col of columns\"\n          class=\"table-td\"\n          [ngClass]=\"'align-' + col.align\"\n        >\n          <ng-container\n            *ngIf=\"col.cellTemplate; else defaultCell\"\n            [ngTemplateOutlet]=\"col.cellTemplate\"\n            [ngTemplateOutletContext]=\"{ $implicit: row[col.key], row: row, index: i }\"\n          ></ng-container>\n          <ng-template #defaultCell>{{ row[col.key] }}</ng-template>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n", styles: [".table-wrap{width:100%;overflow-x:auto;border:1.5px solid #ebebeb;border-radius:8px;background:#fff}.table{width:100%;border-collapse:collapse;font-size:14px;color:#111}.table-head{border-bottom:1.5px solid #ebebeb}.table-th{padding:10px 16px;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.06em;background:#fafafa;white-space:nowrap}.table-td{padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:middle;color:#333;font-size:14px;line-height:1.5}.table-row:last-child .table-td{border-bottom:none}.align-left{text-align:left}.align-center{text-align:center}.align-right{text-align:right}.table-striped .table-row:nth-child(2n) .table-td{background:#fafafa}.table-hoverable .table-row:hover .table-td{background:#f7f7f7;transition:background .1s ease}.table-row-clickable{cursor:pointer}.table-td-state{text-align:center;color:#aaa;padding:40px 16px;font-size:14px}.table-spinner{display:inline-block;width:18px;height:18px;border:2px solid #e0e0e0;border-top-color:#111;border-radius:50%;animation:table-spin .7s linear infinite}@keyframes table-spin{to{transform:rotate(360deg)}}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}\n"] }]
        }], propDecorators: { rows: [{
                type: Input
            }], striped: [{
                type: Input
            }], hoverable: [{
                type: Input
            }], loading: [{
                type: Input
            }], rowClickable: [{
                type: Input
            }], emptyMessage: [{
                type: Input
            }], rowClick: [{
                type: Output
            }], columnDefs: [{
                type: ContentChildren,
                args: [ColumnDefDirective]
            }] } });

class ListComponent {
    divided = true;
    bordered = false;
    compact = false;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: ListComponent, isStandalone: true, selector: "dsb-list", inputs: { divided: "divided", bordered: "bordered", compact: "compact" }, ngImport: i0, template: "<ul\n  class=\"list\"\n  [ngClass]=\"{\n    'list-divided': divided,\n    'list-bordered': bordered,\n    'list-compact': compact\n  }\"\n>\n  <ng-content></ng-content>\n</ul>\n", styles: [".list{list-style:none;margin:0;padding:0}.list-bordered{border:1.5px solid #ebebeb;border-radius:8px;overflow:hidden}.list-divided .list-item+.list-item{border-top:1px solid #f0f0f0}.list-compact .list-item{padding:8px 12px}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-list', standalone: true, imports: [NgClass], template: "<ul\n  class=\"list\"\n  [ngClass]=\"{\n    'list-divided': divided,\n    'list-bordered': bordered,\n    'list-compact': compact\n  }\"\n>\n  <ng-content></ng-content>\n</ul>\n", styles: [".list{list-style:none;margin:0;padding:0}.list-bordered{border:1.5px solid #ebebeb;border-radius:8px;overflow:hidden}.list-divided .list-item+.list-item{border-top:1px solid #f0f0f0}.list-compact .list-item{padding:8px 12px}\n"] }]
        }], propDecorators: { divided: [{
                type: Input
            }], bordered: [{
                type: Input
            }], compact: [{
                type: Input
            }] } });

class ListItemComponent {
    label = '';
    description = '';
    meta = '';
    variant = 'default';
    indicator = false;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ListItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: ListItemComponent, isStandalone: true, selector: "dsb-list-item", inputs: { label: "label", description: "description", meta: "meta", variant: "variant", indicator: "indicator" }, ngImport: i0, template: "<li\n  class=\"list-item\"\n  [ngClass]=\"['list-item--' + variant, indicator ? 'list-item--indicator' : '']\"\n>\n  <span *ngIf=\"indicator\" class=\"list-item-dot\" [ngClass]=\"'dot--' + variant\"></span>\n\n  <div class=\"list-item-leading\">\n    <ng-content select=\"[list-leading]\"></ng-content>\n  </div>\n\n  <div class=\"list-item-body\">\n    <div *ngIf=\"label || meta\" class=\"list-item-top\">\n      <span *ngIf=\"label\" class=\"list-item-label\">{{ label }}</span>\n      <span *ngIf=\"meta\" class=\"list-item-meta\">{{ meta }}</span>\n    </div>\n    <p *ngIf=\"description\" class=\"list-item-description\">{{ description }}</p>\n    <ng-content></ng-content>\n  </div>\n\n  <div class=\"list-item-trailing\">\n    <ng-content select=\"[list-trailing]\"></ng-content>\n  </div>\n</li>\n", styles: [".list-item{display:flex;align-items:center;gap:12px;padding:12px 16px}.list-item-dot{flex-shrink:0;width:8px;height:8px;border-radius:50%}.dot--default{background:#d4d4d4}.dot--info{background:#1a56db}.dot--success{background:#1a7f3c}.dot--warning{background:#92600a}.dot--error{background:#c5221f}.list-item-leading{flex-shrink:0;display:flex;align-items:center}.list-item-leading:empty{display:none}.list-item-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.list-item-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px}.list-item-label{font-size:14px;font-weight:500;color:#111;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.list-item--info .list-item-label{color:#1a56db}.list-item--success .list-item-label{color:#1a7f3c}.list-item--warning .list-item-label{color:#92600a}.list-item--error .list-item-label{color:#c5221f}.list-item-meta{flex-shrink:0;font-size:11px;color:#aaa;white-space:nowrap;font-variant-numeric:tabular-nums}.list-item-description{font-size:13px;color:#666;margin:0;line-height:1.5}.list-item-trailing{flex-shrink:0;display:flex;align-items:center;gap:6px}.list-item-trailing:empty{display:none}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ListItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-list-item', standalone: true, imports: [NgClass, NgIf], template: "<li\n  class=\"list-item\"\n  [ngClass]=\"['list-item--' + variant, indicator ? 'list-item--indicator' : '']\"\n>\n  <span *ngIf=\"indicator\" class=\"list-item-dot\" [ngClass]=\"'dot--' + variant\"></span>\n\n  <div class=\"list-item-leading\">\n    <ng-content select=\"[list-leading]\"></ng-content>\n  </div>\n\n  <div class=\"list-item-body\">\n    <div *ngIf=\"label || meta\" class=\"list-item-top\">\n      <span *ngIf=\"label\" class=\"list-item-label\">{{ label }}</span>\n      <span *ngIf=\"meta\" class=\"list-item-meta\">{{ meta }}</span>\n    </div>\n    <p *ngIf=\"description\" class=\"list-item-description\">{{ description }}</p>\n    <ng-content></ng-content>\n  </div>\n\n  <div class=\"list-item-trailing\">\n    <ng-content select=\"[list-trailing]\"></ng-content>\n  </div>\n</li>\n", styles: [".list-item{display:flex;align-items:center;gap:12px;padding:12px 16px}.list-item-dot{flex-shrink:0;width:8px;height:8px;border-radius:50%}.dot--default{background:#d4d4d4}.dot--info{background:#1a56db}.dot--success{background:#1a7f3c}.dot--warning{background:#92600a}.dot--error{background:#c5221f}.list-item-leading{flex-shrink:0;display:flex;align-items:center}.list-item-leading:empty{display:none}.list-item-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.list-item-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px}.list-item-label{font-size:14px;font-weight:500;color:#111;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.list-item--info .list-item-label{color:#1a56db}.list-item--success .list-item-label{color:#1a7f3c}.list-item--warning .list-item-label{color:#92600a}.list-item--error .list-item-label{color:#c5221f}.list-item-meta{flex-shrink:0;font-size:11px;color:#aaa;white-space:nowrap;font-variant-numeric:tabular-nums}.list-item-description{font-size:13px;color:#666;margin:0;line-height:1.5}.list-item-trailing{flex-shrink:0;display:flex;align-items:center;gap:6px}.list-item-trailing:empty{display:none}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], description: [{
                type: Input
            }], meta: [{
                type: Input
            }], variant: [{
                type: Input
            }], indicator: [{
                type: Input
            }] } });

class AccordionItemComponent {
    title = '';
    open = false;
    disabled = false;
    /** Internal event used by AccordionComponent to coordinate exclusive mode */
    toggled = new EventEmitter();
    toggle() {
        this.open = !this.open;
        this.toggled.emit();
    }
    close() {
        this.open = false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: AccordionItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: AccordionItemComponent, isStandalone: true, selector: "dsb-accordion-item", inputs: { title: "title", open: "open", disabled: "disabled" }, ngImport: i0, template: "<div class=\"accordion-item\" [ngClass]=\"{ 'accordion-item--open': open, 'accordion-item--disabled': disabled }\">\n  <button\n    type=\"button\"\n    class=\"accordion-trigger\"\n    [attr.aria-expanded]=\"open\"\n    [disabled]=\"disabled\"\n    (click)=\"toggle()\"\n  >\n    <span class=\"accordion-title\">{{ title }}</span>\n    <svg\n      class=\"accordion-chevron\"\n      viewBox=\"0 0 10 6\"\n      fill=\"none\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      aria-hidden=\"true\"\n    >\n      <path d=\"M1 1l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  </button>\n\n  <div class=\"accordion-body\" [ngClass]=\"{ 'accordion-body--open': open }\">\n    <div class=\"accordion-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [".accordion-item{border-bottom:1px solid #f0f0f0}.accordion-item:first-child{border-top:1px solid #f0f0f0}.accordion-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;background:none;border:none;padding:16px 0;cursor:pointer;font-family:inherit;text-align:left}.accordion-trigger:focus-visible{outline:2px solid #111;outline-offset:2px;border-radius:3px}.accordion-item--disabled .accordion-trigger{opacity:.42;cursor:not-allowed}.accordion-title{font-size:14px;font-weight:500;color:#111;line-height:1.5}.accordion-chevron{flex-shrink:0;width:10px;height:6px;color:#888;transition:transform .2s ease}.accordion-item--open .accordion-chevron{transform:rotate(180deg)}.accordion-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .2s ease}.accordion-body--open{grid-template-rows:1fr}.accordion-content{overflow:hidden;font-size:14px;color:#555;line-height:1.6}.accordion-body--open .accordion-content{padding-bottom:16px}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: AccordionItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-accordion-item', standalone: true, imports: [NgClass, NgIf], template: "<div class=\"accordion-item\" [ngClass]=\"{ 'accordion-item--open': open, 'accordion-item--disabled': disabled }\">\n  <button\n    type=\"button\"\n    class=\"accordion-trigger\"\n    [attr.aria-expanded]=\"open\"\n    [disabled]=\"disabled\"\n    (click)=\"toggle()\"\n  >\n    <span class=\"accordion-title\">{{ title }}</span>\n    <svg\n      class=\"accordion-chevron\"\n      viewBox=\"0 0 10 6\"\n      fill=\"none\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      aria-hidden=\"true\"\n    >\n      <path d=\"M1 1l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  </button>\n\n  <div class=\"accordion-body\" [ngClass]=\"{ 'accordion-body--open': open }\">\n    <div class=\"accordion-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [".accordion-item{border-bottom:1px solid #f0f0f0}.accordion-item:first-child{border-top:1px solid #f0f0f0}.accordion-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;background:none;border:none;padding:16px 0;cursor:pointer;font-family:inherit;text-align:left}.accordion-trigger:focus-visible{outline:2px solid #111;outline-offset:2px;border-radius:3px}.accordion-item--disabled .accordion-trigger{opacity:.42;cursor:not-allowed}.accordion-title{font-size:14px;font-weight:500;color:#111;line-height:1.5}.accordion-chevron{flex-shrink:0;width:10px;height:6px;color:#888;transition:transform .2s ease}.accordion-item--open .accordion-chevron{transform:rotate(180deg)}.accordion-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .2s ease}.accordion-body--open{grid-template-rows:1fr}.accordion-content{overflow:hidden;font-size:14px;color:#555;line-height:1.6}.accordion-body--open .accordion-content{padding-bottom:16px}\n"] }]
        }], propDecorators: { title: [{
                type: Input
            }], open: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

class AccordionComponent {
    /** When true only one item can be open at a time */
    exclusive = false;
    items;
    ngAfterContentInit() {
        this.items.forEach(item => {
            item.toggled.subscribe(() => {
                if (this.exclusive && item.open) {
                    this.items.filter(i => i !== item).forEach(i => i.close());
                }
            });
        });
        this.items.changes.subscribe(() => {
            this.items.forEach(item => {
                item.toggled.subscribe(() => {
                    if (this.exclusive && item.open) {
                        this.items.filter(i => i !== item).forEach(i => i.close());
                    }
                });
            });
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: AccordionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: AccordionComponent, isStandalone: true, selector: "dsb-accordion", inputs: { exclusive: "exclusive" }, queries: [{ propertyName: "items", predicate: AccordionItemComponent }], ngImport: i0, template: "<ng-content></ng-content>\n", styles: [":host{display:block}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: AccordionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-accordion', standalone: true, imports: [], template: "<ng-content></ng-content>\n", styles: [":host{display:block}\n"] }]
        }], propDecorators: { exclusive: [{
                type: Input
            }], items: [{
                type: ContentChildren,
                args: [AccordionItemComponent]
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { AccordionComponent, AccordionItemComponent, AvatarComponent, BreadcrumbsComponent, ButtonComponent, CheckboxComponent, ColumnDefDirective, DropdownComponent, FooterComponent, HeaderComponent, InputComponent, ListComponent, ListItemComponent, ModalComponent, RadioGroupComponent, TableComponent, TagComponent };
//# sourceMappingURL=jablonowski-dsb-components.mjs.map
