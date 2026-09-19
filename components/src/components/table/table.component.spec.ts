import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { ColumnDefDirective } from './column-def.directive';

@Component({
  standalone: true,
  imports: [TableComponent, ColumnDefDirective],
  template: `
    <dsb-table
      [rows]="rows"
      [loading]="loading"
      [rowClickable]="rowClickable"
      [emptyMessage]="emptyMessage"
      (rowClick)="clicked = $event"
    >
      <dsb-column key="name" header="Name"></dsb-column>
      <dsb-column key="role" header="Role">
        <ng-template #cell let-row="row">role: {{ row['role'] }}</ng-template>
      </dsb-column>
    </dsb-table>
  `,
})
class HostComponent {
  rows: Record<string, unknown>[] = [];
  loading = false;
  rowClickable = false;
  emptyMessage = 'No data to display.';
  clicked: Record<string, unknown> | null = null;
  @ViewChild(TableComponent) table!: TableComponent;
}

describe('TableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  const bodyRows = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr'));

  it('collects projected column definitions', () => {
    fixture.detectChanges();
    expect(host.table.columns.map((c) => c.key)).toEqual(['name', 'role']);
  });

  it('renders the empty message when there are no rows', () => {
    host.emptyMessage = 'Nothing here yet.';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nothing here yet.');
  });

  it('renders one row per record', () => {
    host.rows = [
      { name: 'Ada', role: 'Engineer' },
      { name: 'Grace', role: 'Admiral' },
    ];
    fixture.detectChanges();
    expect(bodyRows()).toHaveLength(2);
  });

  it('reads plain cells by column key', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    fixture.detectChanges();
    expect(bodyRows()[0].textContent).toContain('Ada');
  });

  it('gives a custom cell template the whole row, not just the value', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    fixture.detectChanges();
    // The documented contract is <ng-template #cell let-row="row">; if the row context
    // were not bound, this would render "role: " with nothing after it.
    expect(bodyRows()[0].textContent).toContain('role: Engineer');
  });

  it('does not render data rows while loading', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    host.loading = true;
    fixture.detectChanges();
    expect(bodyRows().some((row) => row.textContent?.includes('Ada'))).toBe(false);
  });

  it('emits rowClick with the row payload when rows are clickable', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    host.rowClickable = true;
    fixture.detectChanges();

    bodyRows()[0].click();
    fixture.detectChanges();

    expect(host.clicked).toEqual({ name: 'Ada', role: 'Engineer' });
  });

  it('activates a clickable row from the keyboard', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    host.rowClickable = true;
    fixture.detectChanges();

    const row = bodyRows()[0];
    expect(row.getAttribute('tabindex')).toBe('0');

    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.clicked).toEqual({ name: 'Ada', role: 'Engineer' });
  });

  it('leaves non-clickable rows out of the tab order', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    host.rowClickable = false;
    fixture.detectChanges();

    expect(bodyRows()[0].getAttribute('tabindex')).toBeNull();
  });

  it('does not emit rowClick when rows are not clickable', () => {
    host.rows = [{ name: 'Ada', role: 'Engineer' }];
    host.rowClickable = false;
    fixture.detectChanges();

    bodyRows()[0].click();
    fixture.detectChanges();

    expect(host.clicked).toBeNull();
  });
});
