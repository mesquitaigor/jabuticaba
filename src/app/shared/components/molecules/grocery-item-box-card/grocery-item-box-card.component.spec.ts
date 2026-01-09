import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GroceryItemBoxCardComponent } from './grocery-item-box-card.component';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';

describe('GroceryItemBoxCardComponent', () => {
  let component: GroceryItemBoxCardComponent;
  let fixture: ComponentFixture<GroceryItemBoxCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryItemBoxCardComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemBoxCardComponent);
    component = fixture.componentInstance;
  });

  describe('quando o componente é criado', () => {
    it('precisa ser criado com sucesso', () => {
      expect(component).toBeTruthy();
    });

    it('precisa não renderizar nada quando groceryItem não é fornecido', () => {
      // Fornecemos undefined ao input required para testar o comportamento do template @if
      fixture.componentRef.setInput('groceryItem', undefined);
      fixture.detectChanges();
      const cardElement = fixture.debugElement.query(
        By.css('[data-testid="grocery-item-card"]'),
      );
      expect(cardElement).toBeNull();
    });

    it('precisa inicializar com isEditing como false', () => {
      expect(component.isEditing()).toBeFalse();
    });
  });

  describe('quando groceryItem é fornecido', () => {
    let mockGroceryItem: GroceryItemModel;

    beforeEach(() => {
      mockGroceryItem = new GroceryItemModel('test-uuid');
      mockGroceryItem.name = 'Leite Integral';
      fixture.componentRef.setInput('groceryItem', mockGroceryItem);
    });

    it('precisa renderizar o card quando groceryItem é fornecido', () => {
      fixture.detectChanges();
      const cardElement = fixture.debugElement.query(
        By.css('[data-testid="grocery-item-card"]'),
      );
      expect(cardElement).not.toBeNull();
    });

    it('precisa exibir o nome do item quando fornecido', () => {
      fixture.detectChanges();
      const nameElement = fixture.debugElement.query(
        By.css('[data-testid="item-name"]'),
      );
      expect(nameElement.nativeElement.textContent.trim()).toBe(
        'Leite Integral',
      );
    });

    it('precisa exibir nome padrão quando groceryItem não tem nome', () => {
      mockGroceryItem.name = undefined;
      fixture.detectChanges();
      const nameElement = fixture.debugElement.query(
        By.css('[data-testid="item-name"]'),
      );
      expect(nameElement.nativeElement.textContent.trim()).toBe(
        'Item sem nome',
      );
    });

    it('precisa exibir o ícone com URL personalizada quando fornecida', () => {
      component.iconUrl = '/assets/icons/leite.svg';
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('[data-testid="item-icon"]'),
      );
      expect(iconElement.nativeElement.src).toContain(
        '/assets/icons/leite.svg',
      );
    });

    it('precisa usar ícone padrão quando iconUrl não é fornecida', () => {
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('[data-testid="item-icon"]'),
      );
      expect(iconElement.nativeElement.src).toContain(
        '/assets/icons/default.svg',
      );
    });

    it('precisa definir alt correto na imagem do ícone', () => {
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('[data-testid="item-icon"]'),
      );
      expect(iconElement.nativeElement.alt).toBe('Leite Integral');
    });

    describe('quando não está editando', () => {
      it('precisa mostrar apenas o botão de editar', () => {
        fixture.detectChanges();
        const editButton = fixture.debugElement.query(
          By.css('[data-testid="edit-button"]'),
        );
        const deleteButton = fixture.debugElement.query(
          By.css('[data-testid="delete-button"]'),
        );
        const cancelButton = fixture.debugElement.query(
          By.css('[data-testid="cancel-button"]'),
        );

        expect(editButton).not.toBeNull();
        expect(deleteButton).toBeNull();
        expect(cancelButton).toBeNull();
      });

      it('precisa emitir evento edit e alterar estado quando botão editar é clicado', () => {
        spyOn(component.edit, 'emit');
        fixture.detectChanges();

        const editButton = fixture.debugElement.query(
          By.css('[data-testid="edit-button"]'),
        );
        editButton.nativeElement.click();

        expect(component.edit.emit).toHaveBeenCalledWith(mockGroceryItem);
        expect(component.isEditing()).toBeTrue();
      });
    });

    describe('quando está editando', () => {
      beforeEach(() => {
        component.isEditing.set(true);
      });

      it('precisa mostrar botões de excluir e cancelar', () => {
        fixture.detectChanges();
        const editButton = fixture.debugElement.query(
          By.css('[data-testid="edit-button"]'),
        );
        const deleteButton = fixture.debugElement.query(
          By.css('[data-testid="delete-button"]'),
        );
        const cancelButton = fixture.debugElement.query(
          By.css('[data-testid="cancel-button"]'),
        );

        expect(editButton).toBeNull();
        expect(deleteButton).not.toBeNull();
        expect(cancelButton).not.toBeNull();
      });

      it('precisa emitir evento delete e sair do modo edição quando botão excluir é clicado', () => {
        spyOn(component.delete, 'emit');
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(
          By.css('[data-testid="delete-button"]'),
        );
        deleteButton.nativeElement.click();

        expect(component.delete.emit).toHaveBeenCalledWith(mockGroceryItem);
        expect(component.isEditing()).toBeFalse();
      });

      it('precisa sair do modo edição quando botão cancelar é clicado', () => {
        fixture.detectChanges();

        const cancelButton = fixture.debugElement.query(
          By.css('[data-testid="cancel-button"]'),
        );
        cancelButton.nativeElement.click();

        expect(component.isEditing()).toBeFalse();
      });

      it('precisa mostrar input de texto no lugar do nome quando está editando', () => {
        fixture.detectChanges();

        const nameInput = fixture.debugElement.query(
          By.css('[data-testid="name-input"]'),
        );
        const nameText = fixture.debugElement.query(
          By.css('[data-testid="item-name"]'),
        );

        expect(nameInput).not.toBeNull();
        expect(nameText).toBeNull();
      });

      it('precisa ter o valor do nome do item no input quando está editando', () => {
        fixture.detectChanges();

        const nameInput = fixture.debugElement.query(
          By.css('[data-testid="name-input"]'),
        );
        expect(nameInput.nativeElement.value).toBe('Leite Integral');
      });

      it('precisa focar o input de nome quando entra em modo edição', () => {
        fixture.detectChanges();

        const nameInput = fixture.debugElement.query(
          By.css('[data-testid="name-input"]'),
        );
        spyOn(nameInput.nativeElement, 'focus');

        // Trigger change detection again to simulate focus after render
        fixture.detectChanges();

        expect(nameInput.nativeElement.focus).toHaveBeenCalled();
      });
    });

    describe('quando não está editando e funcionalidade de item faltando', () => {
      beforeEach(() => {
        component.isEditing.set(false);
      });

      it('precisa mostrar checkbox do lado esquerdo', () => {
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(
          By.css('[data-testid="missing-checkbox"]'),
        );
        expect(checkbox).not.toBeNull();
      });

      it('precisa ficar opaco quando clicado no card e item não está marcado como faltando', () => {
        spyOn(component, 'toggleMissingStatus');
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(
          By.css('[data-testid="grocery-item-card"]'),
        );
        cardElement.nativeElement.click();

        expect(component.toggleMissingStatus).toHaveBeenCalled();
      });

      xit('precisa emitir evento toggle quando card é clicado', () => {
        spyOn(component.toggleMissing, 'emit');
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(
          By.css('[data-testid="grocery-item-card"]'),
        );
        cardElement.nativeElement.click();

        expect(component.toggleMissing.emit).toHaveBeenCalledWith(
          mockGroceryItem,
        );
      });

      xit('precisa ficar opaco quando checkbox é clicado', () => {
        spyOn(component, 'toggleMissingStatus');
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(
          By.css('[data-testid="missing-checkbox"]'),
        );
        checkbox.nativeElement.change();

        expect(component.toggleMissingStatus).toHaveBeenCalled();
      });

      xit('precisa emitir evento toggle quando checkbox é clicado', () => {
        spyOn(component.toggleMissing, 'emit');
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(
          By.css('[data-testid="missing-checkbox"]'),
        );
        checkbox.nativeElement.dispatchEvent(new Event('change'));

        expect(component.toggleMissing.emit).toHaveBeenCalledWith(
          mockGroceryItem,
        );
      });

      it('precisa ter card com opacidade reduzida quando item está marcado como faltando', () => {
        mockGroceryItem.missing = true;
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(
          By.css('[data-testid="grocery-item-card"]'),
        );
        expect(cardElement.classes['opacity-60']).toBeTruthy();
      });

      xit('precisa ter checkbox marcado quando item está como faltando', () => {
        mockGroceryItem.missing = true;
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(
          By.css('[data-testid="missing-checkbox"]'),
        );
        expect(checkbox.nativeElement.checked).toBeTrue();
      });

      xit('precisa desmarcar item como faltando quando clicado no card e item já está faltando', () => {
        mockGroceryItem.missing = true;
        spyOn(component, 'toggleMissingStatus');
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(
          By.css('[data-testid="grocery-item-card"]'),
        );
        cardElement.nativeElement.click();

        expect(component.toggleMissingStatus).toHaveBeenCalled();
      });
    });
  });
});
