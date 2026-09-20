import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioGroupComponent } from './radio.component';

/**
 * The browser suite can assert that a disabled radio group is unreachable — the item is
 * taken out of the pointer flow, so a click never lands. It cannot easily assert the
 * other half: that a change arriving by some other route is refused too. Pointer-events
 * blocks the very interaction the test would need to drive.
 *
 * That half belongs here, where the event can be driven directly.
 */
describe('RadioGroupComponent', () => {
  let fixture: ComponentFixture<RadioGroupComponent>;
  let component: RadioGroupComponent;

  const options = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RadioGroupComponent] }).compileComponents();
    fixture = TestBed.createComponent(RadioGroupComponent);
    component = fixture.componentInstance;
    component.options = options;
    component.value = 'free';
  });

  describe('selection', () => {
    it('updates the value and notifies the form when enabled', () => {
      const emitted: string[] = [];
      const registered: string[] = [];
      component.valueChange.subscribe((v) => emitted.push(v));
      component.registerOnChange((v) => registered.push(v));

      component.onSelect('pro');

      expect(component.value).toBe('pro');
      expect(emitted).toEqual(['pro']);
      expect(registered).toEqual(['pro']);
    });
  });

  describe('disabled group', () => {
    beforeEach(() => {
      component.disabled = true;
    });

    it('refuses a selection', () => {
      component.onSelect('pro');
      expect(component.value).toBe('free');
    });

    it('emits nothing', () => {
      const emitted: string[] = [];
      const registered: string[] = [];
      component.valueChange.subscribe((v) => emitted.push(v));
      component.registerOnChange((v) => registered.push(v));

      component.onSelect('pro');

      expect(emitted).toEqual([]);
      expect(registered).toEqual([]);
    });

    it('is disabled by a reactive form the same way', () => {
      component.disabled = false;
      component.setDisabledState(true);

      component.onSelect('pro');
      expect(component.value).toBe('free');
    });
  });

  describe('disabled option', () => {
    it('refuses that option while the rest of the group still works', () => {
      component.onSelect('enterprise');
      expect(component.value).toBe('free');

      component.onSelect('pro');
      expect(component.value).toBe('pro');
    });
  });

  describe('rendering', () => {
    it('marks every input disabled when the group is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const inputs: HTMLInputElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('input[type="radio"]')
      );
      expect(inputs).toHaveLength(3);
      expect(inputs.every((input) => input.disabled)).toBe(true);
    });

    it('marks only the disabled option when the group is enabled', () => {
      fixture.detectChanges();

      const inputs: HTMLInputElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('input[type="radio"]')
      );
      expect(inputs.map((input) => input.disabled)).toEqual([false, false, true]);
    });

    it('gives every input in the group the same name, so the browser enforces one choice', () => {
      fixture.detectChanges();

      const names = Array.from(
        fixture.nativeElement.querySelectorAll('input[type="radio"]')
      ).map((input) => (input as HTMLInputElement).name);

      expect(new Set(names).size).toBe(1);
      expect(names[0]).toMatch(/^dsb-radio-\d+$/);
    });

    it('renders the legend as a fieldset legend, not as loose text', () => {
      component.legend = 'Choose a plan';
      fixture.detectChanges();

      const legend = fixture.nativeElement.querySelector('fieldset > legend');
      expect(legend?.textContent?.trim()).toBe('Choose a plan');
    });
  });
});
