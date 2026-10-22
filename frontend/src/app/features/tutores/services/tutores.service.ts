import { Observable } from 'rxjs';
import { Tutor, TutorEntrada } from '../tutor.model';

export abstract class TutoresService {
  abstract listar(): Observable<Tutor[]>;
  abstract buscarPorId(id: string): Observable<Tutor>;
  abstract criar(dados: TutorEntrada): Observable<Tutor>;
  abstract atualizar(
    id: string,
    dados: Partial<TutorEntrada>,
  ): Observable<Tutor>;
  abstract remover(id: string): Observable<void>;
}