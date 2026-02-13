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
import { DialogConfig } from './dialog.types';

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

describe(DialogComponent.name, () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let isVisibleSignal: WritableSignal<boolean>;
  let dialogConfigSignal: WritableSignal<DialogConfig<unknown> | null>;

  beforeEach(async () => {
    isVisibleSignal = signal(false);
    dialogConfigSignal = signal(null);

    mockDialogService = jasmine.createSpyObj('DialogService', ['close']);
    Object.defineProperty(mockDialogService, 'isVisible', {
      value: isVisibleSignal,
      writable: false,
    });
    Object.defineProperty(mockDialogService, 'dialogConfig', {
      value: dialogConfigSignal,
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

  describe('quando o dialog não está visível', () => {
    it('precisa ter isVisible como false', () => {
      isVisibleSignal.set(false);
      fixture.detectChanges();

      expect(component.isVisible()).toBe(false);
    });

    it('precisa exibir header padrão quando não há configuração', () => {
      dialogConfigSignal.set(null);
      fixture.detectChanges();

      expect(component.dialogHeader()).toBe('Dialog');
    });

    it('precisa exibir width padrão quando não há configuração', () => {
      dialogConfigSignal.set(null);
      fixture.detectChanges();

      expect(component.dialogWidth()).toBe('90%');
    });
  });

  describe('quando o dialog está visível', () => {
    it('precisa ter isVisible como true', () => {
      isVisibleSignal.set(true);
      fixture.detectChanges();

      expect(component.isVisible()).toBe(true);
    });

    it('precisa exibir o header customizado da configuração', () => {
      dialogConfigSignal.set({
        component: TestDynamicComponent,
        header: 'Custom Header',
      });
      fixture.detectChanges();

      expect(component.dialogHeader()).toBe('Custom Header');
    });

    it('precisa exibir o width customizado da configuração', () => {
      dialogConfigSignal.set({
        component: TestDynamicComponent,
        width: '500px',
      });
      fixture.detectChanges();

      expect(component.dialogWidth()).toBe('500px');
    });

    it('precisa chamar dialogService.close quando onHide é executado', () => {
      component.onHide();

      expect(mockDialogService.close).toHaveBeenCalledTimes(1);
    });
  });
});
