import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export declare class ButtonComponent {
    /** Visual style variant. */
    variant: ButtonVariant;
    /** Visual size variant. */
    size: ButtonSize;
    /** Disables interactions and applies disabled styles. */
    disabled: boolean;
    /** Shows a spinner and blocks interaction. */
    loading: boolean;
    /** Expands button width to fill parent container. */
    fullWidth: boolean;
    /** Native HTML button type attribute. */
    type: 'button' | 'submit' | 'reset';
    /**
     * Emits the native click event.
     * @deprecated Use native (click) binding on the host element.
     */
    onClick: EventEmitter<MouseEvent>;
    get classes(): Record<string, boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ButtonComponent, "dsb-button", never, { "variant": { "alias": "variant"; "required": false; }; "size": { "alias": "size"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "fullWidth": { "alias": "fullWidth"; "required": false; }; "type": { "alias": "type"; "required": false; }; }, { "onClick": "onClick"; }, never, ["*"], true, never>;
}
