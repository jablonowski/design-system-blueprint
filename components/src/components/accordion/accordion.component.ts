import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'dsb-accordion',
  standalone: true,
  imports: [],
  templateUrl: './accordion.component.html',
  styles: [`:host { display: block; }`],
})
export class AccordionComponent implements AfterContentInit {
  /** When true only one item can be open at a time */
  @Input() exclusive = false;

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  ngAfterContentInit(): void {
    this.items.forEach(item => {
      item.toggled.subscribe(() => {
        if (this.exclusive && item.open) {
          this.items.filter(i => i !== item).forEach(i => i.close());
        }
      });
    });

    this.items.changes.subscribe(() => {
      this.items.forEach(item => {
        item.toggled.subscribe(() => {
          if (this.exclusive && item.open) {
            this.items.filter(i => i !== item).forEach(i => i.close());
          }
        });
      });
    });
  }
}
