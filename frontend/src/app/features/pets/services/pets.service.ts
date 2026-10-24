
import { Observable } from 'rxjs';
import { Especie, Pet, PetEntrada } from '../pet.model';

/**
 * CONTRATO do serviço de pets.
 * A lista e o formulário dependem apenas desta classe abstrata.
 * O app.config.ts decide qual implementação será utilizada.
 */
export abstract class PetsService {
  abstract listar(especie?: Especie): Observable<Pet[]>;

  abstract buscarPorId(id: string): Observable<Pet>;

  abstract criar(dados: PetEntrada): Observable<Pet>;

  abstract atualizar(
    id: string,
    dados: Partial<PetEntrada>,
  ): Observable<Pet>;

  abstract remover(id: string): Observable<void>;
}
