import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthMockService } from '../core/auth/auth-mock.service';
import { DialogoConfirmacao } from '../core/ui/dialogo-confirmacao/dialogo-confirmacao';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DialogoConfirmacao],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  protected readonly auth = inject(AuthMockService);
  protected readonly nomeSistema = 'PetShop';
}
