import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type TagSize = 'sm' | 'md';

@Component({
  selector: 'dsb-tag',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
})
export class TagComponent {
  @Input() variant: TagVariant = 'default';
  @Input() size: TagSize = 'md';
}
