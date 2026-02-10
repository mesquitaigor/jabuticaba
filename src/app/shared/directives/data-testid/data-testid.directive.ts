import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { DataTestIdValue } from './data-testid.enum';

@Directive({
  selector: '[jbtDataTestid]',
  standalone: true,
})
export class DataTestidDirective {
  private el = inject(ElementRef);
  public readonly jbtDataTestid = input.required<DataTestIdValue | string>();

  constructor() {
    effect(() => {
      const domElement = this.el.nativeElement as HTMLElement;
      const testId = this.jbtDataTestid();

      if (testId) {
        domElement.setAttribute('data-testid', testId);
      }
    });
  }
}
