import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryIconListSelectionDialog } from './grocery-icon-list-selection.dialog';
import { DataTestIdHelper } from '../../../../tests/helpers/data-testid.helper.spec';
import { GroceryItemIconModel } from '@models/grocery-items';

fdescribe(GroceryIconListSelectionDialog.name, () => {
  let component: GroceryIconListSelectionDialog;
  let fixture: ComponentFixture<GroceryIconListSelectionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryIconListSelectionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryIconListSelectionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('quando ícone é selecionado, deve atualizar o ícone selecionado', () => {
    it('deve mostrar nome do ícone corretamente', () => {
      component.dialogData = {
        id: '',
        selectedIcon: new GroceryItemIconModel('oleo'),
      };
      fixture.detectChanges();
      const iconOption = DataTestIdHelper.queryOrFail(
        fixture.debugElement,
        component.testIds.IconOption,
      );
      iconOption.triggerEventHandler('click', null);
      fixture.detectChanges();
      const iconNameElement = DataTestIdHelper.queryOrFail(
        fixture.debugElement,
        component.testIds.IconName,
      );
      const firstItemIcon = component.icons()[0];
      expect(iconNameElement.nativeElement.textContent).toBe(
        firstItemIcon.description,
      );
    });
  });
});
