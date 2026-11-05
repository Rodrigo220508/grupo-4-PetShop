import { Component, inject } from '@angular/core';
import { AuthMockService } from '../../core/auth/auth-mock.service';
import { RouterLink } from '@angular/router';
import { RelatoriosPainel } from '../../features/relatorios/relatorios-painel/relatorios-painel';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, RelatoriosPainel],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly auth = inject(AuthMockService);
}