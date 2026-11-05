import { Observable } from 'rxjs';
import { Profissional, ProfissionalEntrada } from '../profissional.model';
export abstract class ProfissionaisService {
  abstract listar(): Observable<Profissional[]>;
  abstract buscarPorId(id: string): Observable<Profissional>;
  abstract criar(dados: ProfissionalEntrada): Observable<Profissional>;
  abstract atualizar(id: string, dados: ProfissionalEntrada): Observable<Profissional>;
  abstract remover(id: string): Observable<void>;
}
