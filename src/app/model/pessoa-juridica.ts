import { Pessoa } from "./pessoa";

export class PessoaJuridica extends Pessoa{
  /*constructor(private cod: Number) {
    super();
    this.id = cod;
  }*/

  cnpj?: String;
  inscEstadual?: String;
  nomeFantasia?: String;
  razaoSocial?: string;
  categoria?: String;

}
