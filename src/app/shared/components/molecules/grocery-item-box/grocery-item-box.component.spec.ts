import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemBoxComponent } from './grocery-item-box.component';

fdescribe(GroceryItemBoxComponent.name, () => {
  let component: GroceryItemBoxComponent;
  let fixture: ComponentFixture<GroceryItemBoxComponent>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;

  beforeEach(async () => {
    mockGroceryItemService = jasmine.createSpyObj('GroceryItemService', [
      'updateName',
      'updateMissing',
      'delete',
    ]);

    mockGroceryItemService.updateName.and.returnValue(of(null));
    mockGroceryItemService.updateMissing.and.returnValue(of(null));
    mockGroceryItemService.delete.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [GroceryItemBoxComponent],
      providers: [
        { provide: GroceryItemService, useValue: mockGroceryItemService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemBoxComponent);
    component = fixture.componentInstance;

    const mockGroceryItemModel = new GroceryItemModel('test-uuid-123');
    mockGroceryItemModel.name = 'Leite';
    mockGroceryItemModel.missing = false;

    // Mockar input signal usando setInput()
    fixture.componentRef.setInput('groceryItem', {
      data: mockGroceryItemModel,
      editing: false,
      initialValue: 'Leite',
    });

    fixture.detectChanges();
  });

  describe('Quando o usuário visualiza um item da lista', () => {
    it('deve exibir o nome do item, checkbox e botão de deletar', () => {
      const nomeElement = fixture.debugElement.query(
        By.css('[data-testid="item-name"]'),
      );
      const checkbox = fixture.debugElement.query(
        By.css('[data-testid="missing-checkbox"]'),
      );
      const botaoDeletar = fixture.debugElement.query(
        By.css('[data-testid="delete-button"]'),
      );

      expect(nomeElement?.nativeElement.textContent.trim()).toBe('Leite');
      expect(checkbox?.nativeElement.type).toBe('checkbox');
      expect(botaoDeletar).toBeTruthy();
    });
    it('deve exibir o nome do item', () => {
      const nomeElement = fixture.debugElement.query(
        By.css('[data-testid="item-name"]'),
      );

      expect(nomeElement?.nativeElement.textContent.trim()).toBe('Leite');
    });

    it('deve mostrar checkbox desmarcado quando item não está em falta', () => {
      const checkbox = fixture.debugElement.query(
        By.css('[data-testid="missing-checkbox"]'),
      );
      expect(checkbox.nativeElement.checked).toBe(false);
    });
  });

  describe('Quando o usuário clica no nome do item', () => {
    it('deve ativar o modo de edição mostrando um input', () => {
      const nomeElement = fixture.debugElement.query(
        By.css('[data-testid="item-name"]'),
      );

      nomeElement.nativeElement.click();
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(
        By.css('[data-testid="name-input"]'),
      );
      expect(inputElement?.nativeElement.value).toBe('Leite');
    });
  });

  describe('Quando o usuário termina de editar o nome', () => {
    it('deve salvar o novo nome quando o input perde o foco', () => {
      component.isEditingName = true;
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(
        By.css('[data-testid="name-input"]'),
      );
      inputElement.nativeElement.value = 'Leite Desnatado';
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      inputElement.nativeElement.dispatchEvent(new Event('blur'));

      expect(mockGroceryItemService.updateName).toHaveBeenCalledWith(
        jasmine.objectContaining({ name: 'Leite Desnatado' }),
      );
    });
  });

  describe('Quando o usuário altera o status de falta do item', () => {
    it('deve salvar o novo status quando checkbox é alterado', () => {
      const checkbox = fixture.debugElement.query(
        By.css('[data-testid="missing-checkbox"]'),
      );

      checkbox.nativeElement.checked = true;
      checkbox.nativeElement.dispatchEvent(new Event('change'));

      expect(mockGroceryItemService.updateMissing).toHaveBeenCalledWith(
        jasmine.objectContaining({ missing: true }),
      );
    });
  });

  describe('Quando o usuário remove um item', () => {
    it('deve chamar o serviço de deletar e emitir evento quando botão é clicado', () => {
      spyOn(component.itemDeleted, 'emit');
      const botaoDeletar = fixture.debugElement.query(
        By.css('[data-testid="delete-button"]'),
      );

      botaoDeletar.nativeElement.click();

      expect(mockGroceryItemService.delete).toHaveBeenCalledWith(
        'test-uuid-123',
      );
      expect(component.itemDeleted.emit).toHaveBeenCalledWith('test-uuid-123');
    });
  });
});
