import { Component } from '@angular/core';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';

@Component({
  selector: 'jbt-empty-list-state',
  imports: [DataTestidDirective],
  templateUrl: './empty-list-state.html',
})
export class EmptyListStateComponent {
  public readonly testId = DataTestId.EmptyListState;
}
