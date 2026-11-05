import { Observable } from 'rxjs';
import { Servico, ServicoEntrada } from '../servico.model';
export abstract class ServicosService {
  abstract listar(): Observable<Servico[]>;
  abstract listarTodos(): Observable<Servico[]>;
  abstract buscarPorId(id: string): Observable<Servico>;
  abstract criar(dados: ServicoEntrada): Observable<Servico>;
  abstract atualizar(id: string, dados: ServicoEntrada): Observable<Servico>;
  abstract remover(id: string): Observable<void>;
}
