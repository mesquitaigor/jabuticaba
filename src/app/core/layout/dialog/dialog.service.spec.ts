import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DialogService } from './dialog.service';

@Component({
  selector: 'jbt-test-component',
  template: '<div>Test</div>',
  standalone: true,
})
class TestComponent {}

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
    it('precisa ter dialogConfig como null', () => {
      expect(service.dialogConfig()).toBeNull();
    });

    it('precisa ter isVisible como false', () => {
      expect(service.isVisible()).toBe(false);
    });
  });

  describe('quando open é chamado', () => {
    it('precisa configurar dialogConfig com os dados fornecidos', () => {
      const config = {
        component: TestComponent,
        header: 'Test Header',
        width: '500px',
      };

      service.open(config);

      expect(service.dialogConfig()).toEqual(config);
    });

    it('precisa configurar isVisible como true', () => {
      service.open({ component: TestComponent });

      expect(service.isVisible()).toBe(true);
    });

    it('precisa aceitar configuração com data', () => {
      const config = {
        component: TestComponent,
        data: { id: 1, name: 'Test' },
      };

      service.open(config);

      expect(service.dialogConfig()).toEqual(config);
    });
  });

  describe('quando close é chamado', () => {
    beforeEach(() => {
      service.open({ component: TestComponent, header: 'Test' });
    });

    it('precisa configurar isVisible como false', () => {
      service.close();

      expect(service.isVisible()).toBe(false);
    });

    it('precisa executar callback onClose se fornecido', () => {
      const onCloseSpy = jasmine.createSpy('onClose');
      service.open({
        component: TestComponent,
        onClose: onCloseSpy,
      });

      service.close();

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('precisa limpar dialogConfig após 300ms', fakeAsync(() => {
      service.close();

      expect(service.dialogConfig()).not.toBeNull();

      tick(300);

      expect(service.dialogConfig()).toBeNull();
    }));

    it('precisa funcionar sem erro quando não há callback onClose', () => {
      service.open({ component: TestComponent });

      expect(() => service.close()).not.toThrow();
    });
  });

  describe('quando getComponentRef é chamado', () => {
    it('precisa retornar null', () => {
      expect(service.getComponentRef()).toBeNull();
    });
  });
});
