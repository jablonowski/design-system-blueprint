import * as i0 from '@angular/core';
import { Input, Component } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class ButtonComponent {
    variant = 'primary';
    disabled = false;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: ButtonComponent, isStandalone: true, selector: "dsb-button", inputs: { variant: "variant", disabled: "disabled" }, ngImport: i0, template: `
    <button [class]="'btn-' + variant" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `, isInline: true, styles: ["button{font-family:inherit;font-size:14px;font-weight:500;padding:10px 20px;border-radius:var(--radius-sm);cursor:pointer;transition:all var(--transition-fast);display:inline-flex;align-items:center;justify-content:center;line-height:1}.btn-primary{background:var(--color-primary);color:var(--color-primary-contrast);border:1px solid var(--color-primary)}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}.btn-secondary{background:transparent;color:var(--color-text-main);border:1px solid var(--color-border)}.btn-secondary:hover:not(:disabled){background:var(--color-surface);border-color:var(--color-text-main)}button:disabled{opacity:.5;cursor:not-allowed}button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: ButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-button', standalone: true, imports: [CommonModule], template: `
    <button [class]="'btn-' + variant" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `, styles: ["button{font-family:inherit;font-size:14px;font-weight:500;padding:10px 20px;border-radius:var(--radius-sm);cursor:pointer;transition:all var(--transition-fast);display:inline-flex;align-items:center;justify-content:center;line-height:1}.btn-primary{background:var(--color-primary);color:var(--color-primary-contrast);border:1px solid var(--color-primary)}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}.btn-secondary{background:transparent;color:var(--color-text-main);border:1px solid var(--color-border)}.btn-secondary:hover:not(:disabled){background:var(--color-surface);border-color:var(--color-text-main)}button:disabled{opacity:.5;cursor:not-allowed}button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}\n"] }]
        }], propDecorators: { variant: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

class InputComponent {
    id = `input-${Math.random().toString(36).substr(2, 9)}`;
    label = '';
    type = 'text';
    placeholder = '';
    hasError = false;
    errorMessage = '';
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: InputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.22", type: InputComponent, isStandalone: true, selector: "dsb-input", inputs: { id: "id", label: "label", type: "type", placeholder: "placeholder", hasError: "hasError", errorMessage: "errorMessage" }, ngImport: i0, template: `
    <div class="input-wrapper">
      <label *ngIf="label" [attr.for]="id">{{ label }}</label>
      <input 
        [id]="id" 
        [type]="type" 
        [placeholder]="placeholder" 
        [class.has-error]="hasError"
      />
      <span *ngIf="hasError && errorMessage" class="error-msg">
        {{ errorMessage }}
      </span>
    </div>
  `, isInline: true, styles: [".input-wrapper{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}label{font-size:13px;font-weight:500;color:var(--color-text-main)}input{font-family:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg);color:var(--color-text-main);transition:border-color var(--transition-fast);outline:none}input:focus{border-color:var(--color-primary)}input.has-error{border-color:var(--color-error-text);background-color:var(--color-error-bg)}.error-msg{font-size:12px;color:var(--color-error-text)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.22", ngImport: i0, type: InputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsb-input', standalone: true, imports: [CommonModule], template: `
    <div class="input-wrapper">
      <label *ngIf="label" [attr.for]="id">{{ label }}</label>
      <input 
        [id]="id" 
        [type]="type" 
        [placeholder]="placeholder" 
        [class.has-error]="hasError"
      />
      <span *ngIf="hasError && errorMessage" class="error-msg">
        {{ errorMessage }}
      </span>
    </div>
  `, styles: [".input-wrapper{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}label{font-size:13px;font-weight:500;color:var(--color-text-main)}input{font-family:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg);color:var(--color-text-main);transition:border-color var(--transition-fast);outline:none}input:focus{border-color:var(--color-primary)}input.has-error{border-color:var(--color-error-text);background-color:var(--color-error-bg)}.error-msg{font-size:12px;color:var(--color-error-text)}\n"] }]
        }], propDecorators: { id: [{
                type: Input
            }], label: [{
                type: Input
            }], type: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], hasError: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { ButtonComponent, InputComponent };
//# sourceMappingURL=jablonowski-dsb-components.mjs.map
