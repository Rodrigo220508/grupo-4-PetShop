import { BadRequestException, ConflictException } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';

describe('AtendimentosService — regras RN05, RN06, RN07', () => {
  const modelo = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };
  let service: AtendimentosService;
  const consulta = (resultado: unknown) => ({
    lean: () => ({ exec: () => Promise.resolve(resultado) }),
  });
  const futuro = () => new Date(Date.now() + 7 * 86400000).toISOString();
  const dados = () => ({
    pet: '665f1c2b9a1e4b0012345678',
    servico: '665f1c2b9a1e4b0012345679',
    profissional: '665f1c2b9a1e4b0012345680',
    dataHora: futuro(),
  });

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AtendimentosService(modelo as never);
  });

  it('RN06: não permite agendar no passado', async () => {
    await expect(
      service.criar({ ...dados(), dataHora: '2020-01-01T10:00:00.000Z' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(modelo.create).not.toHaveBeenCalled();
  });

  it('RN05: recusa conflito de profissional e horário', async () => {
    modelo.findOne.mockReturnValue(consulta({ _id: 'outro' }));
    await expect(service.criar(dados())).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(modelo.create).not.toHaveBeenCalled();
  });

  it('permite criar atendimento válido com status agendado', async () => {
    modelo.findOne.mockReturnValue(consulta(null));
    modelo.create.mockResolvedValue({
      toObject: () => ({ ...dados(), status: 'agendado' }),
    });
    const resposta = await service.criar(dados());
    expect(resposta.status).toBe('agendado');
  });

  it('RN07: recusa transição concluído para agendado', async () => {
    modelo.findById.mockReturnValue(consulta({ status: 'concluido' }));
    await expect(
      service.mudarStatus('665f1c2b9a1e4b0012345678', 'agendado'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(modelo.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('RN07: aceita agendado para cancelado', async () => {
    modelo.findById.mockReturnValue(consulta({ status: 'agendado' }));
    modelo.findOneAndUpdate.mockReturnValue(consulta({ status: 'cancelado' }));
    const resposta = await service.mudarStatus(
      '665f1c2b9a1e4b0012345678',
      'cancelado',
    );
    expect(resposta.status).toBe('cancelado');
  });
});
