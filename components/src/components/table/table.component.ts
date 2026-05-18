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
  template: `
    <div class="table-wrap">
      <table class="table" [ngClass]="{ 'table-striped': striped, 'table-hoverable': hoverable }">
        <thead class="table-head">
          <tr>
            <th
              *ngFor="let col of columns"
              class="table-th"
              [style.width]="col.width || null"
              [ngClass]="'align-' + col.align"
            >
              <ng-container *ngIf="col.headerTemplate; else defaultHeader">
                <ng-container [ngTemplateOutlet]="col.headerTemplate"></ng-container>
              </ng-container>
              <ng-template #defaultHeader>{{ col.header }}</ng-template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="loading">
            <td [attr.colspan]="columns.length" class="table-td table-td-state">
              <span class="table-spinner" aria-hidden="true"></span>
              <span class="sr-only">Loading…</span>
            </td>
          </tr>
          <tr *ngIf="!loading && rows.length === 0">
            <td [attr.colspan]="columns.length" class="table-td table-td-state">
              {{ emptyMessage }}
            </td>
          </tr>
          <tr
            *ngFor="let row of rows; let i = index"
            class="table-row"
            [ngClass]="{ 'table-row-clickable': rowClickable }"
            (click)="rowClick.emit(row)"
          >
            <td
              *ngFor="let col of columns"
              class="table-td"
              [ngClass]="'align-' + col.align"
            >
              <ng-container
                *ngIf="col.cellTemplate; else defaultCell"
                [ngTemplateOutlet]="col.cellTemplate"
                [ngTemplateOutletContext]="{ $implicit: row[col.key], row: row, index: i }"
              ></ng-container>
              <ng-template #defaultCell>{{ row[col.key] }}</ng-template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
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
