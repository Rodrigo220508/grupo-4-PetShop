import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RelatoriosPainel } from '../../features/relatorios/relatorios-painel/relatorios-painel';
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, RelatoriosPainel],
  template: `
    <section class="boas-vindas">
      <h1>PetShop · Painel inicial</h1>
      <p>Gerencie cadastros, agendamentos e indicadores em um só lugar.</p>
    </section>
    <div class="atalhos">
      <a class="cartao" routerLink="/atendimentos"
        ><h2>Agenda de atendimentos</h2>
        <p>Agendar, editar ou atualizar o status.</p></a
      >
      <a class="cartao" routerLink="/pets"
        ><h2>Pets</h2>
        <p>Consultar e cadastrar animais.</p></a
      >
      <a class="cartao" routerLink="/relatorios"
        ><h2>Relatórios</h2>
        <p>Ver totais e indicadores.</p></a
      >
    </div>
    <app-relatorios-painel />
  `,
})
export class Inicio {}
