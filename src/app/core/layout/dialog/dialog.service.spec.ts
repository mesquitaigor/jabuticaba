import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DialogService } from './dialog.service';

@Component({
  selector: 'jbt-test-component',
  template: '<div>Test</div>',
  standalone: true,
})
class TestComponent {}

@Component({
  selector: 'jbt-another-test-component',
  template: '<div>Another Test</div>',
  standalone: true,
})
class AnotherTestComponent {}

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogService);
  });

  it('precisa criar o service', () => {
    expect(service).toBeTruthy();
  });

  describe('quando o service é inicializado', () => {
    it('precisa ter activeDialogs como array vazio', () => {
      expect(service.activeDialogs()).toEqual([]);
    });

    it('precisa ter hasVisibleDialogs como false', () => {
      expect(service.hasVisibleDialogs()).toBe(false);
    });

    it('precisa manter compatibilidade com dialogConfig retornando null', () => {
      expect(service.dialogConfig()).toBeNull();
    });

    it('precisa manter compatibilidade com isVisible retornando false', () => {
      expect(service.isVisible()).toBe(false);
    });
  });

  describe('quando open é chamado', () => {
    it('precisa retornar um ID único para o diálogo', () => {
      const dialogId = service.open({ component: TestComponent });

      expect(dialogId).toBeTruthy();
      expect(typeof dialogId).toBe('string');
    });

    it('precisa adicionar o diálogo à lista de ativos', () => {
      const config = {
        component: TestComponent,
        header: 'Test Header',
        width: '500px',
      };

      const dialogId = service.open(config);

      expect(service.activeDialogs().length).toBe(1);
      expect(service.activeDialogs()[0].id).toBe(dialogId);
      expect(service.activeDialogs()[0].config).toEqual(config);
      expect(service.activeDialogs()[0].isVisible).toBe(true);
    });

    it('precisa usar ID customizado quando fornecido', () => {
      const customId = 'custom-dialog-id';
      const config = {
        id: customId,
        component: TestComponent,
      };

      const dialogId = service.open(config);

      expect(dialogId).toBe(customId);
    });

    it('precisa permitir múltiplos diálogos abertos simultaneamente', () => {
      service.open({ component: TestComponent });
      service.open({ component: TestComponent });
      expect(service.activeDialogs().length).toBe(2);
      expect(service.hasVisibleDialogs()).toBe(true);
    });

    it('precisa atualizar compatibilidade com isVisible quando há diálogos', () => {
      service.open({ component: TestComponent });

      expect(service.isVisible()).toBe(true);
    });

    it('precisa atualizar compatibilidade com dialogConfig para primeiro diálogo', () => {
      const config = { component: TestComponent, header: 'Test' };
      service.open(config);

      expect(service.dialogConfig()).toEqual(config);
    });
  });

  describe('quando close é chamado', () => {
    let dialogId: string;

    beforeEach(() => {
      dialogId = service.open({ component: TestComponent, header: 'Test' });
    });

    it('precisa marcar o diálogo como não visível', () => {
      service.close(dialogId);

      const dialog = service.activeDialogs().find((d) => d.id === dialogId);
      expect(dialog?.isVisible).toBe(false);
    });

    it('precisa executar callback onClose se fornecido', () => {
      const onCloseSpy = jasmine.createSpy('onClose');
      const id = service.open({
        component: TestComponent,
        onClose: onCloseSpy,
      });

      service.close(id);

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('precisa remover o diálogo da lista após 300ms', fakeAsync(() => {
      service.close(dialogId);

      expect(service.activeDialogs().length).toBe(1);

      tick(300);

      expect(service.activeDialogs().length).toBe(0);
    }));

    it('precisa não fazer nada quando ID não existe', () => {
      const initialCount = service.activeDialogs().length;

      service.close('non-existent-id');

      expect(service.activeDialogs().length).toBe(initialCount);
    });

    it('precisa manter outros diálogos abertos', () => {
      service.open({ component: TestComponent });

      service.close(dialogId);

      expect(service.activeDialogs().length).toBe(2); // Um marked for close, outro aberto
      expect(service.getVisibleDialogs().length).toBe(1);
    });
  });

  describe('quando closeAll é chamado', () => {
    beforeEach(() => {
      service.open({ component: TestComponent });
      service.open({ component: AnotherTestComponent });
    });

    it('precisa fechar todos os diálogos', fakeAsync(() => {
      service.closeAll();

      expect(service.getVisibleDialogs().length).toBe(0);

      tick(300);

      expect(service.activeDialogs().length).toBe(0);
    }));
  });

  describe('métodos utilitários', () => {
    let dialogId: string;

    beforeEach(() => {
      dialogId = service.open({
        component: TestComponent,
        header: 'Test Header',
      });
    });

    it('precisa verificar se um diálogo específico está aberto', () => {
      expect(service.isDialogOpen(dialogId)).toBe(true);
      expect(service.isDialogOpen('non-existent')).toBe(false);
    });

    it('precisa retornar configuração de diálogo específico', () => {
      const config = service.getDialogConfig(dialogId);

      expect(config?.component).toBe(TestComponent);
      expect(config?.header).toBe('Test Header');
    });

    it('precisa retornar null para configuração de ID inexistente', () => {
      expect(service.getDialogConfig('non-existent')).toBeNull();
    });

    it('precisa retornar apenas diálogos visíveis', () => {
      const visibleDialogs = service.getVisibleDialogs();

      expect(visibleDialogs.length).toBe(1);
      expect(visibleDialogs[0].isVisible).toBe(true);

      service.close(dialogId);

      expect(service.getVisibleDialogs().length).toBe(0);
    });
  });
});
