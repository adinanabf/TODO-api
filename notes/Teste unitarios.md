# Teste unitários

- Beneficios

1. Detecção precoce de erros: Os testes unitários permitem identificar problemas no código logo no início do desenvolvimento. Ao testar unidades individuais, como funções ou métodos, é possível encontrar e corrigir erros antes que se propaguem para outras partes do sistema.

2. Facilita a manutenção do código: Testes unitários bem escritos fornecem uma base sólida para refatorar ou modificar o código. Ao realizar alterações, os testes garantem que as funcionalidades existentes continuem a funcionar conforme o esperado, evitando regressões.

3. Garantia de qualidade: Os testes unitários são uma forma de garantir a qualidade do código. Ao escrever testes que cobrem todos os cenários possíveis, você pode ter mais confiança de que o software está funcionando corretamente. Isso ajuda a evitar bugs e problemas no produto final.

4. Documentação viva: Os testes unitários servem como documentação viva do comportamento do código. Ao ler os testes, é possível entender as expectativas de entrada e saída das unidades testadas, o que facilita a compreensão do código em um nível mais detalhado.

5. Suporte à refatoração: Com testes unitários, é possível realizar refatorações com mais segurança. Ao modificar o código, os testes ajudam a garantir que as alterações não quebrem a funcionalidade existente.

6. Redução de tempo de depuração: Com testes unitários, é mais fácil identificar a origem de um problema. Se um teste falha, você sabe exatamente qual unidade está com um comportamento inesperado, o que facilita a depuração e correção.

7. Facilidade na integração contínua: Testes unitários são fundamentais para integração contínua, pois permitem validar rapidamente as mudanças de código e automatizar a verificação de qualidade do software.

Os testes unitários são uma prática essencial no desenvolvimento de software, pois oferecem uma série de benefícios que ajudam a melhorar a qualidade, a confiabilidade e a manutenibilidade do código.

## Mocks

Mocks são objetos simulados que permitem testar o comportamento de uma dependência em um ambiente controlado durante a execução de testes unitários. Eles são usados para substituir componentes ou funções externas em um teste, permitindo que você isole a unidade de código que está sendo testada.

- Quando usar mocks:

Quando uma função ou módulo depende de outro componente externo.
Quando a dependência externa possui um comportamento complexo ou difícil de reproduzir em um teste.
Benefícios dos mocks:

Permitem a simulação de comportamentos específicos, como retornar valores predefinidos ou lançar exceções.
Reduzem a dependência de recursos externos, como bancos de dados ou APIs.
Tornam os testes mais rápidos e independentes, pois não há necessidade de interagir com dependências reais.
