import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

export interface CellContext {
  /** Cell value for the current row and column key. */
  $implicit: unknown;
  /** Full row object for rich templates. */
  row: Record<string, unknown>;
  /** Zero-based row index. */
  index: number;
}

@Directive({ selector: 'dsb-column', standalone: true })
export class ColumnDefDirective {
  /** Key used to read value from row object. */
  @Input({ required: true }) key!: string;
  /** Header cell text. */
  @Input() header = '';
  /** Accessible label for header when text is not enough. */
  @Input() headerAriaLabel = '';
  /** Optional CSS width for this column (e.g. 240px, 20%). */
  @Input() width = '';
  /** Horizontal alignment for header and cell content. */
  @Input() align: 'left' | 'center' | 'right' = 'left';

  /** Cell template reference. Must be declared as #cell. */
  @ContentChild('cell') cellTemplate?: TemplateRef<CellContext>;
  /** Optional custom header template reference declared as #headerCell. */
  @ContentChild('headerCell') headerTemplate?: TemplateRef<void>;
}
