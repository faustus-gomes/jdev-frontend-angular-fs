import { identifierName } from "@angular/compiler";
import { BigInteger } from "jsbn";
import { PessoaJuridica } from "./pessoa-juridica";

export class FormaPagamento {

    constructor(){}

    id?: Number;
    descricao?: String;
    empresa?: PessoaJuridica;
}
