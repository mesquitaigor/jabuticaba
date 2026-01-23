import { Component } from '@angular/core';

@Component({
  selector: 'jbt-logo',
  imports: [],
  template: '<img [src]="logoSrc" [alt]="logoAlt" />',
})
export class LogoComponent {
  public readonly logoAlt = 'Jabuticaba app';
  public readonly logoSrc = 'icons/logo.svg';
}
