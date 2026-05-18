import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'rounded';

@Component({
  selector: 'dsb-avatar',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `
    <span
      class="avatar"
      [ngClass]="['avatar-' + size, 'avatar-' + shape, src ? 'avatar-img' : 'avatar-initials']"
      [attr.aria-label]="alt || name || null"
      role="img"
    >
      <img *ngIf="src" [src]="src" [alt]="alt || name" class="avatar-image" />
      <span *ngIf="!src" class="avatar-text">{{ initials }}</span>
    </span>
  `,
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() name = '';
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarVariant = 'circle';

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
}
