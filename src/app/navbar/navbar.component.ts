import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Route, Router } from '@angular/router';
import { PermissionService } from '../services/permissao.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor (private loginService: LoginService,
                private permissionService: PermissionService,  // 👈 Adicione isso
                private router: Router  // 👈 Opcional, para redirecionar
  ) {}

  deslogar(): void{
    this.loginService.deslogar();
  }

  // Método para verificar permissão no template
  hasPermission(roles: string[]): boolean {
    return this.permissionService.hasPermission(roles);
  }

  // Método específico para o menu Acesso (opcional)
  canAccessAcesso(): boolean {
    return this.hasPermission(['ROLE_ADMIN']);
  }

}
