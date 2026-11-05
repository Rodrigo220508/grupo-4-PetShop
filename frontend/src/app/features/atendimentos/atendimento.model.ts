import { Referencia } from '../../core/models/referencia';
export const STATUS = ['agendado', 'em_atendimento', 'concluido', 'cancelado'] as const;
export type Status = (typeof STATUS)[number];
export const TRANSICOES: Record<Status, Status[]> = {
  agendado: ['em_atendimento', 'cancelado'],
  em_atendimento: ['concluido'],
  concluido: [],
  cancelado: [],
};
export interface Atendimento {
  _id: string;
  pet: Referencia;
  servico: Referencia;
  profissional: Referencia;
  dataHora: string;
  observacoes?: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}
export interface AtendimentoEntrada {
  pet: string;
  servico: string;
  profissional: string;
  dataHora: string;
  observacoes?: string;
}
