import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

export interface CellContext {
  $implicit: unknown;
  row: Record<string, unknown>;
  index: number;
}

@Directive({ selector: 'dsb-column', standalone: true })
export class ColumnDefDirective {
  @Input({ required: true }) key!: string;
  @Input() header = '';
  @Input() width = '';
  @Input() align: 'left' | 'center' | 'right' = 'left';

  @ContentChild('cell') cellTemplate?: TemplateRef<CellContext>;
  @ContentChild('headerCell') headerTemplate?: TemplateRef<void>;
}
