import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Atendimento } from '../atendimentos/schemas/atendimento.schema';
import { Pet } from '../pets/schemas/pet.schema';
import { Tutor } from '../tutores/schemas/tutor.schema';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
import { PATH_METADATA } from '@nestjs/common/constants';

describe('RelatoriosService', () => {
  let service: RelatoriosService;

  const consulta = (v: unknown) => ({ exec: () => Promise.resolve(v) });
  const tutorModel = { countDocuments: jest.fn() };
  const petModel = { countDocuments: jest.fn() };
  const atendimentoModel = { countDocuments: jest.fn(), aggregate: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modulo = await Test.createTestingModule({
      providers: [
        RelatoriosService,
        { provide: getModelToken(Tutor.name), useValue: tutorModel },
        { provide: getModelToken(Pet.name), useValue: petModel },
        {
          provide: getModelToken(Atendimento.name),
          useValue: atendimentoModel,
        },
      ],
    }).compile();
    service = modulo.get(RelatoriosService);
  });

  it('resumo devolve os três totais usando countDocuments', async () => {
    tutorModel.countDocuments.mockReturnValue(consulta(4));
    petModel.countDocuments.mockReturnValue(consulta(6));
    atendimentoModel.countDocuments.mockReturnValue(consulta(2));

    await expect(service.resumo()).resolves.toEqual({
      tutores: 4,
      pets: 6,
      atendimentosAgendados: 2,
    });
    expect(atendimentoModel.countDocuments).toHaveBeenCalledWith({
      status: 'agendado',
    });
  });

  it('atendimentosPorStatus chama aggregate e devolve o resultado', async () => {
    const dados = [{ _id: 'concluido', quantidade: 3 }];
    atendimentoModel.aggregate.mockReturnValue(consulta(dados));

    await expect(service.atendimentosPorStatus()).resolves.toEqual(dados);
    expect(atendimentoModel.aggregate).toHaveBeenCalled();
  });

  it('faturamentoPorServico considera só os atendimentos concluídos', async () => {
    const dados = [{ servico: 'Banho', quantidade: 2, faturamento: 100 }];
    atendimentoModel.aggregate.mockReturnValue(consulta(dados));

    await expect(service.faturamentoPorServico()).resolves.toEqual(dados);
    const pipeline = (
      atendimentoModel.aggregate.mock.calls as unknown[][]
    )[0][0];
    expect(pipeline).toContainEqual({ $match: { status: 'concluido' } });
  });

  it('sem dados, as consultas devolvem lista vazia (sem erro)', async () => {
    atendimentoModel.aggregate.mockReturnValue(consulta([]));

    await expect(service.atendimentosPorStatus()).resolves.toEqual([]);
    await expect(service.faturamentoPorServico()).resolves.toEqual([]);
  });

  it('o controller expõe as rotas com os nomes do contrato da API', () => {
    const rota = (metodo: keyof RelatoriosController): string =>
      Reflect.getMetadata(
        PATH_METADATA,
        RelatoriosController.prototype[metodo],
      ) as string;

    expect(Reflect.getMetadata(PATH_METADATA, RelatoriosController)).toBe(
      'relatorios',
    );
    expect(rota('resumo')).toBe('resumo');
    expect(rota('atendimentosPorStatus')).toBe('atendimentos-por-status');
    expect(rota('faturamentoPorServico')).toBe('faturamento-por-servico');
  });
});
