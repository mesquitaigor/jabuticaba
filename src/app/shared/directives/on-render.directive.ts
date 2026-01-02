import { Directive, ElementRef, inject, OnInit, output } from '@angular/core';

@Directive({
  selector: '[jbtOnRender]',
  standalone: true,
})
export class OnRenderDirective implements OnInit {
  private el = inject(ElementRef);
  public readonly jbtOnRender = output<HTMLElement>();
  ngOnInit(): void {
    const domElement = this.el.nativeElement;
    this.jbtOnRender.emit(domElement);
  }
}
