import { Injectable, Type, ComponentRef, signal } from '@angular/core';

export interface DialogConfig<T, I = unknown> {
  component: Type<T>;
  header?: string;
  data?: I;
  width?: string;
  onClose?: () => void;
}

export interface DialogInstance {
  close: () => void;
}

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
  public open<T, I>(config: DialogConfig<T, I>): void {
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
