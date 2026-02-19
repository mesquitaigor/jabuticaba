import {
  Component,
  ViewContainerRef,
  ComponentRef,
  effect,
  computed,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from './dialog.service';
import { DialogState } from './dialog.types';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
export type dialogData<T> = T & { id: string };
export interface DialogRef<T> {
  dialogData?: dialogData<T>;
}
@Component({
  selector: 'jbt-dialog',
  imports: [DialogModule, DataTestidDirective],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  @ViewChildren('dynamicComponentContainer', { read: ViewContainerRef })
  public dynamicComponentContainers!: QueryList<ViewContainerRef>;

  private readonly dialogService = inject(DialogService);
  private componentRefs = new Map<string, ComponentRef<unknown>>();

  public readonly testId = DataTestId;

  /**
   * Array de diálogos ativos
   */
  public readonly dialogs = computed(() => this.dialogService.activeDialogs());

  constructor() {
    // Efeito para gerenciar os componentes dinâmicos
    effect(() => {
      const dialogs = this.dialogs();
      this.updateComponents(dialogs);
    });
  }

  /**
   * Atualiza os componentes baseado no estado dos diálogos
   */
  private updateComponents(dialogs: DialogState[]): void {
    const currentDialogIds = new Set(dialogs.map((d) => d.id));

    // Remove componentes de diálogos que não existem mais
    this.componentRefs.forEach((componentRef, dialogId) => {
      if (!currentDialogIds.has(dialogId)) {
        componentRef.destroy();
        this.componentRefs.delete(dialogId);
      }
    });

    // Aguarda um microtask para garantir que os ViewChildren sejam inicializados
    Promise.resolve().then(() => {
      this.loadMissingComponents(dialogs);
    });
  }

  /**
   * Carrega componentes que ainda não foram criados
   */
  private loadMissingComponents(dialogs: DialogState[]): void {
    if (!this.dynamicComponentContainers) {
      return;
    }

    const containers = this.dynamicComponentContainers.toArray();

    dialogs.forEach((dialog, index) => {
      if (!this.componentRefs.has(dialog.id) && dialog.isVisible) {
        const container = containers[index];
        if (container) {
          this.loadComponent(dialog, container);
        }
      }
    });
  }

  /**
   * Carrega um componente específico em um container
   */
  private loadComponent(
    dialog: DialogState,
    container: ViewContainerRef,
  ): void {
    try {
      container.clear();
      const componentRef: ComponentRef<DialogRef<unknown>> =
        container.createComponent(dialog.config.component) as ComponentRef<
          DialogRef<unknown>
        >;

      if (dialog.config.data && componentRef.instance) {
        componentRef.instance.dialogData = {
          ...dialog.config.data,
          id: dialog.id,
        };
      }
      componentRef.changeDetectorRef.detectChanges();
      this.componentRefs.set(dialog.id, componentRef);
    } catch (error) {
      console.error(
        `Erro ao carregar componente para o diálogo ${dialog.id}:`,
        error,
      );
    }
  }

  /**
   * Handler para quando um dialog é fechado
   */
  public onHide(dialogId: string): void {
    this.dialogService.close(dialogId);
  }

  /**
   * Obtém o cabeçalho do diálogo
   */
  public getDialogHeader(dialog: DialogState): string {
    return dialog.config.header || 'Dialog';
  }

  /**
   * Obtém a largura do diálogo
   */
  public getDialogWidth(dialog: DialogState): string {
    return dialog.config.width || '90%';
  }

  /**
   * Track function para ngFor
   */
  public trackDialogById(dialog: DialogState): string {
    return dialog.id;
  }
}
