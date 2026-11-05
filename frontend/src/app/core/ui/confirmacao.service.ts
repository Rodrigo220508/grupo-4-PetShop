import { Injectable, signal } from '@angular/core';

/** Um único contrato de confirmação para todas as telas do PetShop. */
export interface PedidoConfirmacao {
  titulo: string;
  descricao: string;
  textoConfirmar: string;
  tipo?: 'perigo' | 'padrao';
}

@Injectable({ providedIn: 'root' })
export class ConfirmacaoService {
  private readonly pedidoAtual = signal<PedidoConfirmacao | null>(null);
  readonly pedido = this.pedidoAtual.asReadonly();
  private resolverPendente?: (resultado: boolean) => void;

  confirmar(opcoes: PedidoConfirmacao): Promise<boolean> {
    // Evita abrir dois diálogos sobrepostos.
    if (this.pedidoAtual()) return Promise.resolve(false);
    return new Promise<boolean>((resolver) => {
      this.resolverPendente = resolver;
      this.pedidoAtual.set(opcoes);
    });
  }

  responder(confirmou: boolean): void {
    if (!this.resolverPendente) return;
    const resolver = this.resolverPendente;
    this.resolverPendente = undefined;
    this.pedidoAtual.set(null);
    resolver(confirmou);
  }
}
