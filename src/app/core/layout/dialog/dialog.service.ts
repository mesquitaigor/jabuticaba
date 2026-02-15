import { Injectable, ComponentRef, signal } from '@angular/core';
import { DialogConfig } from './dialog.types';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public readonly dialogConfig = signal<DialogConfig<unknown> | null>(null);
  public readonly isVisible = signal(false);

  /**
   * Abre o dialog com um componente dinâmico
   * @param config Configuração do dialog incluindo o componente a ser renderizado
   */
  public open<T, I = unknown>(config: DialogConfig<T, I>): void {
    this.dialogConfig.set(config);
    this.isVisible.set(true);
  }

  /**
   * Fecha o dialog e executa callback se fornecido
   */
  public close(): void {
    const config = this.dialogConfig();
    this.isVisible.set(false);

    if (config?.onClose) {
      config.onClose();
    }

    // Limpa a configuração após um pequeno delay para permitir animação de saída
    setTimeout(() => {
      this.dialogConfig.set(null);
    }, 300);
  }

  /**
   * Retorna a instância do componente atual (se existir)
   */
  public getComponentRef<T>(): ComponentRef<T> | null {
    return null; // Será populado pelo DialogComponent
  }
}
