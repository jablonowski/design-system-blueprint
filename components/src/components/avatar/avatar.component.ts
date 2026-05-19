import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'rounded';

@Component({
  selector: 'dsb-avatar',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './avatar.component.html',
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
