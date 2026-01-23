import { Component, input } from '@angular/core';

@Component({
  selector: 'jbt-logo',
  imports: [],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  public readonly showTitle = input<boolean>(false);
  public readonly logoAlt = 'Jabuticaba app';
  public readonly title = 'Jabuticaba';
  public readonly logoSrc = 'icons/logo.svg';
}
