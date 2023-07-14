# Factory Pattern

1. Encapsulamento da criação de objetos: O Factory Pattern encapsula o processo de criação de objetos em uma função ou método específico. Isso ajuda a centralizar a lógica de criação em um único local, facilitando a manutenção e evitando a duplicação de código.

2. Abstração da criação de objetos: O Factory Pattern permite criar objetos de diferentes tipos ou classes sem expor os detalhes da implementação. Isso fornece uma abstração para a criação de objetos, permitindo que o código cliente trabalhe com interfaces genéricas ou classes base, em vez de se preocupar com a lógica específica de criação.

3. Flexibilidade na criação de objetos: O Factory Pattern permite que você introduza lógica adicional na criação de objetos, como a configuração de propriedades ou a escolha de implementações específicas com base em determinadas condições. Isso oferece flexibilidade para adaptar a criação de objetos de acordo com as necessidades do aplicativo.

4. Separação de responsabilidades: O Factory Pattern ajuda a separar a responsabilidade de criação de objetos do restante do código. Isso promove um design mais modular e facilita a manutenção, pois as alterações na lógica de criação podem ser feitas em um único local, sem afetar o código cliente.

5. Suporte a código mais legível e escalável: Com o Factory Pattern, o código cliente pode se concentrar apenas na utilização dos objetos, sem se preocupar com os detalhes da criação. Isso torna o código mais legível e mais fácil de entender. Além disso, o padrão Factory suporta a adição de novos tipos de objetos sem modificar o código existente, o que torna o sistema mais escalável.

6. Facilidade de teste: O Factory Pattern facilita a criação de testes, pois é possível substituir a fábrica por uma versão de teste que retorna objetos falsos ou simulados. Isso ajuda a isolar o código que utiliza os objetos criados pela fábrica, permitindo testes mais controlados e eficientes.

fontes:

- [Factory Method](https://refactoring.guru/pt-br/design-patterns/factory-method)
