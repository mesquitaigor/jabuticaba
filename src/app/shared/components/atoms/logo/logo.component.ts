import { Component, input } from '@angular/core';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';

@Component({
  selector: 'jbt-logo',
  imports: [DataTestidDirective],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  public readonly showTitle = input<boolean>(false);
  public readonly logoAlt = 'Jabuticaba app';
  public readonly title = 'Jabuticaba';
  public readonly logoSrc = 'icons/logo.svg';

  // Expõe o enum para o template
  public readonly testIds = DataTestId;
}
