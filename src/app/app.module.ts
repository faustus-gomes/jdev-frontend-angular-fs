import { PessoaJuridica } from './model/pessoa-juridica';
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorProjetoInterceptor } from './interceptor/interceptor-projeto.interceptor';
import { HomeComponent } from './home/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { guardiaoGuard } from './guard/guardiao.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { CategoriaProdutoComponent } from './components/categoria-produto/categoria-produto.component';
import { MarcaProdutoComponent } from './components/marca-produto/marca-produto.component';
import { AcessoComponent } from './components/acesso/acesso.component';
import { PessoaJuridicaComponent } from './components/pessoa-juridica/pessoa-juridica.component';
import { FormaPagamentoComponent } from './components/forma-pagamento/forma-pagamento.component';


export const appRoutes : Routes= [

  {path: 'login', component: LoginComponent},
  {path: '', component: AppComponent},
  {path: 'home', component: HomeComponent, canActivate:[guardiaoGuard], data:{role:['ROLE_ADMIN','ROLE_GERENTE']}},
  {path: 'categoria_produto', component: CategoriaProdutoComponent, canActivate:[guardiaoGuard], data:{role:['ROLE_ADMIN','ROLE_GERENTE']}},
  {path: 'marca_produto', component: MarcaProdutoComponent, canActivate:[guardiaoGuard], data:{role:['ROLE_ADMIN','ROLE_GERENTE']}},
  {path: 'acesso', component: AcessoComponent, canActivate:[guardiaoGuard], data:{role:['ROLE_ADMIN']}},
  {path: 'PessoaJuridica', component: PessoaJuridicaComponent, canActivate:[guardiaoGuard], data:{role:['ROLE_ADMIN']}},
  {path: 'Forma-Pagamento', component: FormaPagamentoComponent, canActivate:[guardiaoGuard], data:{role:['ROLE_ADMIN']}}
];

export const routes = RouterModule.forRoot(appRoutes);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    CategoriaProdutoComponent,
    MarcaProdutoComponent,
    AcessoComponent,
    PessoaJuridicaComponent,
    FormaPagamentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule ,//Aqui onde fazemos as requisições no backEnd
    routes
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: InterceptorProjetoInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
