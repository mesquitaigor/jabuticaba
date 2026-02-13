import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  effect,
  computed,
  inject,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from './dialog.service';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';

@Component({
  selector: 'jbt-dialog',
  imports: [DialogModule, DataTestidDirective],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  public dynamicComponentContainer!: ViewContainerRef;
  private readonly dialogService = inject(DialogService);

  public readonly testId = DataTestId;
  public readonly isVisible = this.dialogService.isVisible;

  public readonly dialogHeader = computed(() => {
    const config = this.dialogService.dialogConfig();
    return config?.header || 'Dialog';
  });

  public readonly dialogWidth = computed(() => {
    const config = this.dialogService.dialogConfig();
    return config?.width || '90%';
  });

  private componentRef: ComponentRef<unknown> | null = null;

  constructor() {
    // Efeito para carregar o componente dinâmico quando o dialog é aberto
    effect(() => {
      const config = this.dialogService.dialogConfig();

      if (config && this.isVisible()) {
        this.loadComponent();
      } else {
        this.clearComponent();
      }
    });
  }

  /**
   * Carrega o componente dinâmico no container
   */
  private loadComponent(): void {
    const config = this.dialogService.dialogConfig();

    if (!config || !this.dynamicComponentContainer) {
      return;
    }

    // Limpa componente anterior se existir
    this.clearComponent();

    // Cria o componente dinamicamente
    this.componentRef = this.dynamicComponentContainer.createComponent(
      config.component,
    );

    // Se houver dados, injeta no componente
    if (config.data && this.componentRef.instance) {
      Object.assign(this.componentRef.instance, config.data);
    }

    // Detecta mudanças
    this.componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Remove o componente dinâmico do container
   */
  private clearComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    if (this.dynamicComponentContainer) {
      this.dynamicComponentContainer.clear();
    }
  }

  /**
   * Handler para quando o dialog é fechado
   */
  public onHide(): void {
    this.dialogService.close();
  }
}
