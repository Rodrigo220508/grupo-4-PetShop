import { computed, Injectable, signal } from '@angular/core';

/** Usuários locais para a demonstração do Checkpoint C1. Sem API nem banco. */
export interface UsuarioMock {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'atendente';
}

interface ContaMock {
  usuario: UsuarioMock;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  // Conta explicitamente fictícia. NÃO reproduzir este padrão em produção.
  private readonly contas: ContaMock[] = [{
    usuario: { id: 'demo-1', nome: 'Administrador Demo', email: 'admin@petshop.demo', perfil: 'admin' },
    senha: 'Petshop123!',
  }];

  readonly usuario = signal<UsuarioMock | null>(null);
  readonly estaLogado = computed(() => this.usuario() !== null);

  entrar(email: string, senha: string): void {
    const conta = this.contas.find(c => c.usuario.email === email.trim().toLowerCase() && c.senha === senha);
    if (!conta) throw new Error('E-mail ou senha incorretos.');
    this.usuario.set({ ...conta.usuario });
  }

  cadastrar(nome: string, email: string, senha: string): void {
    const emailNormalizado = email.trim().toLowerCase();
    if (this.contas.some(c => c.usuario.email === emailNormalizado)) {
      throw new Error('Este e-mail já está cadastrado na demonstração.');
    }
    const usuario: UsuarioMock = {
      id: `demo-${this.contas.length + 1}`,
      nome: nome.trim(),
      email: emailNormalizado,
      perfil: 'atendente',
    };
    this.contas.push({ usuario, senha });
  }

  sair(): void {
    this.usuario.set(null);
  }

}
