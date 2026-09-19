import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AvatarComponent] }).compileComponents();
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  describe('initials fallback', () => {
    it('uses first and last initial for a multi-part name', () => {
      component.name = 'Mateusz Jabłonowski';
      expect(component.initials).toBe('MJ');
    });

    it('ignores middle names', () => {
      component.name = 'Ada Byron King Lovelace';
      expect(component.initials).toBe('AL');
    });

    it('uses the first two letters for a single-part name', () => {
      component.name = 'prince';
      expect(component.initials).toBe('PR');
    });

    it('collapses irregular whitespace', () => {
      component.name = '  Grace   Hopper  ';
      expect(component.initials).toBe('GH');
    });

    it('falls back to ? for an empty name', () => {
      component.name = '';
      expect(component.initials).toBe('?');
    });

    it('falls back to ? for a whitespace-only name', () => {
      component.name = '   ';
      expect(component.initials).toBe('?');
    });

    it('handles a single-letter name without overflowing', () => {
      component.name = 'X';
      expect(component.initials).toBe('X');
    });
  });

  describe('rendering', () => {
    it('renders the image when src is set', () => {
      component.src = 'https://example.test/a.png';
      component.alt = 'Portrait of Ada';
      fixture.detectChanges();

      const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img');
      expect(img).not.toBeNull();
      expect(img!.getAttribute('alt')).toBe('Portrait of Ada');
    });

    it('renders initials instead of an image when src is empty', () => {
      component.src = '';
      component.name = 'Ada Lovelace';
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('img')).toBeNull();
      expect(fixture.nativeElement.textContent).toContain('AL');
    });

    it('applies the size and shape modifier classes', () => {
      component.size = 'lg';
      component.shape = 'rounded';
      fixture.detectChanges();

      const host: HTMLElement = fixture.nativeElement.querySelector('.avatar');
      expect(host.className).toContain('avatar-lg');
      expect(host.className).toContain('avatar-rounded');
    });
  });
});
