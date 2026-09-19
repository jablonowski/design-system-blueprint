import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <dsb-accordion [exclusive]="exclusive">
      <dsb-accordion-item title="One">first</dsb-accordion-item>
      <dsb-accordion-item title="Two">second</dsb-accordion-item>
      <dsb-accordion-item title="Three" [disabled]="true">third</dsb-accordion-item>
    </dsb-accordion>
  `,
})
class HostComponent {
  exclusive = false;
  @ViewChild(AccordionComponent) accordion!: AccordionComponent;
}

describe('AccordionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  const items = (): AccordionItemComponent[] => host.accordion.items.toArray();
  const triggers = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.accordion-trigger'));

  it('projects every item into the accordion', () => {
    fixture.detectChanges();
    expect(items()).toHaveLength(3);
  });

  it('allows several items open at once by default', () => {
    fixture.detectChanges();

    triggers()[0].click();
    triggers()[1].click();
    fixture.detectChanges();

    expect(items()[0].open).toBe(true);
    expect(items()[1].open).toBe(true);
  });

  it('closes the others when exclusive is on', () => {
    host.exclusive = true;
    fixture.detectChanges();

    triggers()[0].click();
    fixture.detectChanges();
    expect(items()[0].open).toBe(true);

    triggers()[1].click();
    fixture.detectChanges();

    expect(items()[0].open).toBe(false);
    expect(items()[1].open).toBe(true);
  });

  it('does not close the others when an item is collapsed in exclusive mode', () => {
    host.exclusive = true;
    fixture.detectChanges();

    triggers()[0].click(); // open
    triggers()[1].click(); // open second, closes first
    fixture.detectChanges();

    triggers()[1].click(); // collapse second
    fixture.detectChanges();

    expect(items()[1].open).toBe(false);
    expect(items()[0].open).toBe(false);
  });

  it('does not toggle a disabled item', () => {
    fixture.detectChanges();

    const disabledTrigger = triggers()[2];
    expect(disabledTrigger.disabled).toBe(true);

    disabledTrigger.click();
    fixture.detectChanges();

    expect(items()[2].open).toBe(false);
  });

  it('exposes expanded state to assistive technology', () => {
    fixture.detectChanges();
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('false');

    triggers()[0].click();
    fixture.detectChanges();

    expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');
  });
});
