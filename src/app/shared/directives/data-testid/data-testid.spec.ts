import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTestidDirective } from './data-testid.directive';
import { DataTestId } from './data-testid.enum';

@Component({
  template: `<div [jbtDataTestid]="testId"></div>`,
  standalone: true,
  imports: [DataTestidDirective],
})
class TestComponent {
  testId: string = DataTestId.GroceryItemRegistryDialog.SaveButton;
}

describe(DataTestidDirective.name, () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement.querySelector('div');
  });

  describe('quando a diretiva é aplicada', () => {
    it('precisa adicionar o atributo data-testid ao elemento', () => {
      fixture.detectChanges();

      expect(element.getAttribute('data-testid')).toBe(
        DataTestId.GroceryItemRegistryDialog.SaveButton,
      );
    });

    it('precisa atualizar o atributo quando o valor muda', () => {
      fixture.detectChanges();
      expect(element.getAttribute('data-testid')).toBe(
        DataTestId.GroceryItemRegistryDialog.SaveButton,
      );

      fixture.componentInstance.testId = DataTestId.GroceryList.Item;
      fixture.detectChanges();

      expect(element.getAttribute('data-testid')).toBe(
        DataTestId.GroceryList.Item,
      );
    });
  });
});
