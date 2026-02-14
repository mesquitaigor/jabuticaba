import { Component, output } from '@angular/core';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jbt-error-list-state',
  imports: [DataTestidDirective, ButtonModule],
  templateUrl: './error-list-state.component.html',
})
export class ErrorListStateComponent {
  public readonly reloadList = output<void>();
  public readonly testId = DataTestId.ErrorListState;
}
