import { Pessoa } from "./pessoa";

export class PessoaFisica extends Pessoa{
  /*constructor(private cod: Number) {
    super();
    this.id = cod;
  }*/

  cpf?: String;
  dataNascimento?: String;

}
