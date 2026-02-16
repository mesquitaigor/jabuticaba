import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';
import { DialogModule } from 'primeng/dialog';
import { DialogState } from './dialog.types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'p-dialog',
  template: '<ng-content></ng-content>',
  standalone: true,
})
class MockPDialogComponent {
  public readonly visible = input(false);
  public readonly header = input('');
  public readonly modal = input(false);
  public readonly style = input<Record<string, unknown>>({});
  public readonly draggable = input(false);
  public readonly resizable = input(false);
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public readonly onHide = output<void>();
}

@Component({
  selector: 'jbt-test-dynamic',
  template: '<div>Test Component</div>',
  standalone: true,
})
class TestDynamicComponent {}

@Component({
  selector: 'jbt-another-test-dynamic',
  template: '<div>Another Test Component</div>',
  standalone: true,
})
class AnotherTestDynamicComponent {}

describe(DialogComponent.name, () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let activeDialogsSignal: WritableSignal<DialogState[]>;

  beforeEach(async () => {
    activeDialogsSignal = signal([]);

    mockDialogService = jasmine.createSpyObj('DialogService', ['close']);
    Object.defineProperty(mockDialogService, 'activeDialogs', {
      value: activeDialogsSignal,
      writable: false,
    });

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [{ provide: DialogService, useValue: mockDialogService }],
    })
      .overrideComponent(DialogComponent, {
        remove: {
          imports: [DialogModule],
        },
        add: {
          imports: [MockPDialogComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
  });

  it('precisa criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('quando não há diálogos', () => {
    it('precisa ter array de diálogos vazio', () => {
      activeDialogsSignal.set([]);
      fixture.detectChanges();

      expect(component.dialogs()).toEqual([]);
    });
  });

  describe('quando há um diálogo', () => {
    const mockDialog: DialogState = {
      id: 'dialog-1',
      config: {
        component: TestDynamicComponent,
        header: 'Test Header',
        width: '500px',
      },
      isVisible: true,
    };

    beforeEach(() => {
      activeDialogsSignal.set([mockDialog]);
      fixture.detectChanges();
    });

    it('precisa exibir o diálogo corretamente', () => {
      expect(component.dialogs().length).toBe(1);
      expect(component.dialogs()[0]).toEqual(mockDialog);
    });

    it('precisa retornar header customizado da configuração', () => {
      const header = component.getDialogHeader(mockDialog);

      expect(header).toBe('Test Header');
    });

    it('precisa retornar width customizado da configuração', () => {
      const width = component.getDialogWidth(mockDialog);

      expect(width).toBe('500px');
    });

    it('precisa chamar dialogService.close com ID correto quando onHide é executado', () => {
      component.onHide('dialog-1');

      expect(mockDialogService.close).toHaveBeenCalledWith('dialog-1');
    });
  });

  describe('quando há múltiplos diálogos', () => {
    const mockDialogs: DialogState[] = [
      {
        id: 'dialog-1',
        config: {
          component: TestDynamicComponent,
          header: 'First Dialog',
          width: '400px',
        },
        isVisible: true,
      },
      {
        id: 'dialog-2',
        config: {
          component: AnotherTestDynamicComponent,
          header: 'Second Dialog',
        },
        isVisible: true,
      },
    ];

    beforeEach(() => {
      activeDialogsSignal.set(mockDialogs);
      fixture.detectChanges();
    });

    it('precisa exibir todos os diálogos', () => {
      expect(component.dialogs().length).toBe(2);
      expect(component.dialogs()).toEqual(mockDialogs);
    });

    it('precisa retornar headers corretos para cada diálogo', () => {
      expect(component.getDialogHeader(mockDialogs[0])).toBe('First Dialog');
      expect(component.getDialogHeader(mockDialogs[1])).toBe('Second Dialog');
    });

    it('precisa retornar widths corretos para cada diálogo', () => {
      expect(component.getDialogWidth(mockDialogs[0])).toBe('400px');
      expect(component.getDialogWidth(mockDialogs[1])).toBe('90%'); // default
    });

    it('precisa fechar diálogo específico quando onHide é chamado', () => {
      component.onHide('dialog-2');

      expect(mockDialogService.close).toHaveBeenCalledWith('dialog-2');
    });
  });

  describe('métodos de suporte', () => {
    const mockDialog: DialogState = {
      id: 'dialog-test',
      config: {
        component: TestDynamicComponent,
      },
      isVisible: true,
    };

    it('precisa retornar header padrão quando não configurado', () => {
      const header = component.getDialogHeader(mockDialog);

      expect(header).toBe('Dialog');
    });

    it('precisa retornar width padrão quando não configurado', () => {
      const width = component.getDialogWidth(mockDialog);

      expect(width).toBe('90%');
    });

    it('precisa rastrear diálogos corretamente pelo ID', () => {
      const trackResult = component.trackDialogById(mockDialog);

      expect(trackResult).toBe('dialog-test');
    });
  });
});
