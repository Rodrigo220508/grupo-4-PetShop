import { Observable } from 'rxjs';
import { Atendimento, AtendimentoEntrada, Status } from '../atendimento.model';
export abstract class AtendimentosService {
  abstract listar(status?: Status): Observable<Atendimento[]>;
  abstract buscarPorId(id: string): Observable<Atendimento>;
  abstract criar(dados: AtendimentoEntrada): Observable<Atendimento>;
  abstract atualizar(id: string, dados: AtendimentoEntrada): Observable<Atendimento>;
  abstract mudarStatus(id: string, status: Status): Observable<Atendimento>;
}
