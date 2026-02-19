import { Injectable, signal, computed } from '@angular/core';
import { DialogConfig, DialogState } from './dialog.types';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialogs = signal<DialogState[]>([]);
  private dialogCounter = 0;

  /**
   * Array de diálogos ativos
   */
  public readonly activeDialogs = computed(() => this.dialogs());

  /**
   * Verifica se há diálogos visíveis
   */
  public readonly hasVisibleDialogs = computed(() =>
    this.dialogs().some((dialog) => dialog.isVisible),
  );

  /**
   * Gera um ID único para o diálogo
   */
  private generateDialogId(): string {
    return `dialog-${++this.dialogCounter}-${Date.now()}`;
  }

  /**
   * Abre um novo diálogo com um componente dinâmico
   * @param config Configuração do dialog incluindo o componente a ser renderizado
   * @returns ID do diálogo criado
   */
  public open<T, I = unknown, O = unknown>(
    config: DialogConfig<T, I, O>,
  ): string {
    const dialogId = config.id || this.generateDialogId();

    const dialogState: DialogState = {
      id: dialogId,
      config: config as DialogConfig<unknown>,
      isVisible: true,
    };

    this.dialogs.update((dialogs) => [...dialogs, dialogState]);

    return dialogId;
  }

  /**
   * Fecha um diálogo específico pelo ID ou o último aberto se nenhum ID for fornecido
   * @param dialogId ID do diálogo a ser fechado (opcional - se não fornecido, fecha o último dialog aberto)
   * @param data Dados a serem passados para o callback de fechamento (opcional)
   */
  public close<O = null>(dialogId?: string, data: O | null = null): void {
    // Se não for fornecido ID, fecha o último dialog visível (mais recente)
    if (!dialogId) {
      const visibleDialogs = this.getVisibleDialogs();
      if (visibleDialogs.length === 0) {
        return; // Não há diálogos para fechar
      }
      // Pega o último dialog da lista (mais recente)
      dialogId = visibleDialogs[visibleDialogs.length - 1].id;
    }

    const dialog = this.dialogs().find((d) => d.id === dialogId);

    if (!dialog) {
      return;
    }

    // Marca como não visível para animação
    this.dialogs.update((dialogs) =>
      dialogs.map((d) => (d.id === dialogId ? { ...d, isVisible: false } : d)),
    );

    // Executa callback se fornecido
    if (dialog.config.onClose) {
      dialog.config.onClose(data);
    }

    // Remove da lista após delay para animação
    setTimeout(() => {
      this.dialogs.update((dialogs) =>
        dialogs.filter((d) => d.id !== dialogId),
      );
    }, 300);
  }

  /**
   * Fecha todos os diálogos
   */
  public closeAll(): void {
    const dialogIds = this.dialogs().map((d) => d.id);
    dialogIds.forEach((id) => this.close(id));
  }

  /**
   * Verifica se um diálogo específico está aberto
   * @param dialogId ID do diálogo
   */
  public isDialogOpen(dialogId: string): boolean {
    return this.dialogs().some((d) => d.id === dialogId && d.isVisible);
  }

  /**
   * Obtém a configuração de um diálogo específico
   * @param dialogId ID do diálogo
   */
  public getDialogConfig(dialogId: string): DialogConfig<unknown> | null {
    const dialog = this.dialogs().find((d) => d.id === dialogId);
    return dialog?.config || null;
  }

  /**
   * Obtém todos os diálogos visíveis
   */
  public getVisibleDialogs(): DialogState[] {
    return this.dialogs().filter((d) => d.isVisible);
  }

  /**
   * Legacy: Para compatibilidade com código antigo
   * @deprecated Use open() que retorna o ID do diálogo
   */
  public readonly dialogConfig = computed(() => {
    const visibleDialogs = this.getVisibleDialogs();
    return visibleDialogs.length > 0 ? visibleDialogs[0].config : null;
  });

  /**
   * Legacy: Para compatibilidade com código antigo
   * @deprecated Use hasVisibleDialogs
   */
  public readonly isVisible = computed(() => this.hasVisibleDialogs());
}
