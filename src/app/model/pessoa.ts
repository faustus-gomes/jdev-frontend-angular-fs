import { PessoaJuridica } from "./pessoa-juridica";

export class Pessoa {
  id?: Number;
  nome?: String;
  email?: String;
  telefone?: String;
  tipoPessoa?: String;
  asaasId?: String;
  dataCadastro?: String;
  //enderecos
  empresa?: PessoaJuridica;

  /**
      @OneToMany(mappedBy = "pessoa", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Endereco> enderecos = new ArrayList<Endereco>();


    @ManyToOne(targetEntity = Pessoa.class)
    @JoinColumn(name = "empresa_id", nullable = true,
            foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "empresa_fk"))
    private Pessoa empresa;
   *
  */

  constructor() {

  }

}
