import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorProjetoInterceptor } from './interceptor/interceptor-projeto.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule //Aqui onde fazemos as requisições no backEnd
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: InterceptorProjetoInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
