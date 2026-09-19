import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  const nativeButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  describe('class map', () => {
    it('defaults to a medium primary button', () => {
      expect(component.classes).toMatchObject({
        btn: true,
        'btn-primary': true,
        'btn-md': true,
      });
    });

    it('reflects variant and size', () => {
      component.variant = 'danger';
      component.size = 'lg';
      expect(component.classes['btn-danger']).toBe(true);
      expect(component.classes['btn-lg']).toBe(true);
    });

    it('marks full width and loading state', () => {
      component.fullWidth = true;
      component.loading = true;
      expect(component.classes['btn-full']).toBe(true);
      expect(component.classes['btn-loading']).toBe(true);
    });
  });

  describe('disabled and loading', () => {
    it('disables the native button when disabled is set', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(nativeButton().disabled).toBe(true);
    });

    it('disables the native button while loading, so a request cannot be fired twice', () => {
      component.loading = true;
      fixture.detectChanges();
      expect(nativeButton().disabled).toBe(true);
    });

    it('does not emit onClick while disabled', () => {
      const spy = jest.fn();
      component.onClick.subscribe(spy);
      component.disabled = true;
      fixture.detectChanges();

      nativeButton().click();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('type attribute', () => {
    it('defaults to button so it never submits a form by accident', () => {
      fixture.detectChanges();
      expect(nativeButton().getAttribute('type')).toBe('button');
    });

    it('honours an explicit submit type', () => {
      component.type = 'submit';
      fixture.detectChanges();
      expect(nativeButton().getAttribute('type')).toBe('submit');
    });
  });
});
