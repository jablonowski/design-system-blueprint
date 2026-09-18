import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ColumnDefDirective } from './column-def.directive';

@Component({
  selector: 'dsb-table',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements AfterContentInit {
  /** Dataset rows rendered by matching column keys. */
  @Input() rows: Record<string, unknown>[] = [];
  /** Applies zebra striping to row backgrounds. */
  @Input() striped = false;
  /** Enables hover highlight for data rows. */
  @Input() hoverable = true;
  /** Shows loading state instead of data rows. */
  @Input() loading = false;
  /** Enables row click behavior and pointer affordance. */
  @Input() rowClickable = false;
  /** Message rendered when rows is empty. */
  @Input() emptyMessage = 'No data to display.';

  /** Emits clicked row payload when rowClickable is true. */
  @Output() rowClick = new EventEmitter<Record<string, unknown>>();

  @ContentChildren(ColumnDefDirective) columnDefs!: QueryList<ColumnDefDirective>;
  columns: ColumnDefDirective[] = [];

  ngAfterContentInit(): void {
    this.columns = this.columnDefs.toArray();
    this.columnDefs.changes.subscribe(() => {
      this.columns = this.columnDefs.toArray();
    });
  }
}
