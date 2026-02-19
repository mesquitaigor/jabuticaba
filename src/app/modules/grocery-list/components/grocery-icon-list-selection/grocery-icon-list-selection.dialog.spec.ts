import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryIconListSelectionDialog } from './grocery-icon-list-selection.dialog';
import { DataTestIdHelper } from '../../../../tests/helpers/data-testid.helper.spec';
import { GroceryItemIconModel } from '@models/grocery-items';
import { DialogServiceMock } from '../../../../tests/mocks/dialog.service.mock.spec';
import { DialogService } from '@layout/dialog';
import ButtonHelper from '../../../../tests/helpers/button.helper.spec';
import { DataTestId } from '@directives/data-testid';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';

fdescribe(GroceryIconListSelectionDialog.name, () => {
  let component: GroceryIconListSelectionDialog;
  let fixture: ComponentFixture<GroceryIconListSelectionDialog>;
  const dialogServiceMock = new DialogServiceMock();
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  beforeEach(async () => {
    dialogServiceMock.create();
    await TestBed.configureTestingModule({
      imports: [GroceryIconListSelectionDialog],
      providers: [dialogServiceMock.getProvider()],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryIconListSelectionDialog);
    component = fixture.componentInstance;
    dialogServiceSpy = dialogServiceMock.getSpy();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
  describe('quando ícone na lista é clicado', () => {
    it('deve exibir o ícone clicado como pré-visualização', () => {
      fixture.detectChanges();
      const iconOption = DataTestIdHelper.queryOrFail(
        fixture.debugElement,
        component.testIds.IconOption,
      );
      iconOption.triggerEventHandler('click', null);
      fixture.detectChanges();
      const previewIcon = DataTestIdHelper.queryOrFail(
        fixture.debugElement,
        component.testIds.SelectedIcon,
      );
      const groceryItemIconComponent =
        previewIcon.componentInstance as GroceryItemIconComponent;
      expect(groceryItemIconComponent.iconName()).toBe(component.icons()[0]);
    });
    it('deve exibir o nome do ícone corretamente', () => {
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
  describe('quando componente é inicializado', () => {
    it('deve exibir o ícone selecionado no dialogData', () => {
      const expectedIcon = new GroceryItemIconModel('oleo');
      component.dialogData = {
        id: '',
        selectedIcon: expectedIcon,
      };
      fixture.detectChanges();
      const selectedIconElement = DataTestIdHelper.queryOrFail(
        fixture.debugElement,
        component.testIds.SelectedIcon,
      );
      const iconElement =
        selectedIconElement.componentInstance as GroceryItemIconComponent;
      expect(iconElement.iconName()).toBe(expectedIcon);
    });
  });
  describe('quando usuário clicar no botão de cancelar', () => {
    it('deve fechar o dialog sem enviar dados', () => {
      fixture.detectChanges();
      ButtonHelper.clickButton(
        fixture,
        DataTestId.GroceryIconListSelectionDialog.CancelButton,
      );
      fixture.detectChanges();
      expect(dialogServiceSpy.close).toHaveBeenCalled();
    });
  });
  describe('quando usuário clicar no botão de confirmar', () => {
    beforeEach(() => {
      component.dialogData = {
        id: 'dialog-id',
        selectedIcon: new GroceryItemIconModel('oleo'),
      };
      fixture.detectChanges();
      ButtonHelper.clickButton(
        fixture,
        DataTestId.GroceryIconListSelectionDialog.SaveButton,
      );
      fixture.detectChanges();
    });
    it('deve fechar o dialog', () => {
      expect(dialogServiceSpy.close).toHaveBeenCalled();
    });
    it('deve enviar o ícone selecionado ao fechar o dialog', () => {
      expect(dialogServiceSpy.close).toHaveBeenCalledWith(
        'dialog-id',
        new GroceryItemIconModel('oleo'),
      );
    });
  });
});
