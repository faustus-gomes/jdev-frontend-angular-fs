import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


   // Métodos para navegação dos botões
    acessarAdminSI() {
        console.log('Navegando para Admin S.I');
        // this.router.navigate(['/admin-si']);
    }

    acessarIntranet() {
        console.log('Navegando para Intranet');
        // this.router.navigate(['/intranet']);
    }

    acessarPortalSite() {
        console.log('Navegando para Portal-Site');
        // this.router.navigate(['/portal-site']);
    }

    // Métodos para o dashboard
    verDetalhesPagar() {
        console.log('Ver detalhes de contas a pagar');
        // Implementar navegação ou modal
        // this.router.navigate(['/contas-pagar']);
    }

    verDetalhesReceber() {
        console.log('Ver detalhes de contas a receber');
        // Implementar navegação ou modal
        // this.router.navigate(['/contas-receber']);
    }

}
