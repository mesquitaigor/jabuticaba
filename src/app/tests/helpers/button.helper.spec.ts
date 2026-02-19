import { ComponentFixture } from '@angular/core/testing';
import { DataTestIdHelper } from './data-testid.helper.spec';
import { DataTestIdValue } from '@directives/data-testid/data-testid.enum';
import { Button } from 'primeng/button';

export default class ButtonHelper {
  public static clickButton(
    fixture: ComponentFixture<unknown>,
    testId: DataTestIdValue,
  ): void {
    const confirmButton = DataTestIdHelper.queryOrFail(
      fixture.debugElement,
      testId,
    );
    const pButton = confirmButton.componentInstance as Button;
    pButton.onClick.emit();
  }
}
