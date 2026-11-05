import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ConfirmacaoService } from '../confirmacao.service';

/** Modal nativo, acessível e reaproveitável. Renderizado uma vez no layout. */
@Component({
  selector: 'app-dialogo-confirmacao',
  standalone: true,
  templateUrl: './dialogo-confirmacao.html',
  styleUrl: './dialogo-confirmacao.css',
})
export class DialogoConfirmacao {
  protected readonly confirmacao = inject(ConfirmacaoService);
  private readonly elemento = viewChild<ElementRef<HTMLDialogElement>>('dialogo');

  constructor() {
    effect(() => {
      const pedido = this.confirmacao.pedido();
      const dialogo = this.elemento()?.nativeElement;
      if (!dialogo) return;
      if (pedido && !dialogo.open) dialogo.showModal();
      if (!pedido && dialogo.open) dialogo.close();
    });
  }

  protected cancelar(event: Event): void {
    // Escape é tratado pelo elemento <dialog>, sem perder a decisão do usuário.
    event.preventDefault();
    this.confirmacao.responder(false);
  }

  protected cliqueNoFundo(event: MouseEvent): void {
    if (event.target === this.elemento()?.nativeElement) {
      this.confirmacao.responder(false);
    }
  }
}
