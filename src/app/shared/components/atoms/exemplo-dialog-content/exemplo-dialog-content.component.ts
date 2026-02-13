import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogService } from '../../../../core/layout/dialog/dialog.service';

@Component({
  selector: 'jbt-exemplo-dialog-content',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="exemplo-dialog-content">
      <h3>{{ titulo() }}</h3>
      <p>{{ mensagem() }}</p>

      <div class="actions">
        <p-button label="Cancelar" severity="secondary" (onClick)="fechar()" />
        <p-button
          label="Confirmar"
          severity="success"
          (onClick)="confirmar()"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .exemplo-dialog-content {
        padding: 1rem;

        h3 {
          margin-top: 0;
          color: var(--primary-color);
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }
      }
    `,
  ],
})
export class ExemploDialogContentComponent {
  // Propriedades que podem ser injetadas via 'data'
  public titulo = input<string>('Título de Exemplo');
  public mensagem = input<string>(
    'Esta é uma mensagem de exemplo dentro do dialog dinâmico!',
  );
  public onConfirm = input<(() => void) | undefined>();

  constructor(private dialogService: DialogService) {}

  fechar(): void {
    this.dialogService.close();
  }

  confirmar(): void {
    const callback = this.onConfirm();
    if (callback) {
      callback();
    }
    this.dialogService.close();
  }
}
