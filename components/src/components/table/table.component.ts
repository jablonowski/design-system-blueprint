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
  @Input() rows: Record<string, unknown>[] = [];
  @Input() striped = false;
  @Input() hoverable = true;
  @Input() loading = false;
  @Input() rowClickable = false;
  @Input() emptyMessage = 'No data to display.';

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
