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

  /**
   * Row clicks only leave the component when the consumer opted in. Emitting
   * unconditionally makes `rowClickable` a styling flag with a behavioural side
   * effect, which is exactly the "looks right, behaves wrong" failure the visual
   * tests cannot see.
   */
  emitRowClick(row: Record<string, unknown>): void {
    if (!this.rowClickable) return;
    this.rowClick.emit(row);
  }

  /** Space activates a clickable row without scrolling the page. */
  onRowKeydownSpace(event: Event, row: Record<string, unknown>): void {
    if (!this.rowClickable) return;
    event.preventDefault();
    this.rowClick.emit(row);
  }

  ngAfterContentInit(): void {
    this.columns = this.columnDefs.toArray();
    this.columnDefs.changes.subscribe(() => {
      this.columns = this.columnDefs.toArray();
    });
  }
}
