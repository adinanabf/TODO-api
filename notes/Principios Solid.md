# Princípios SOLID

- Single Responsibility Principle (Princípio da Responsabilidade Única):

  - O princípio da Responsabilidade Única estabelece que uma classe, módulo ou função deve ter apenas uma responsabilidade. Isso significa que cada componente do seu sistema deve ter um único motivo para mudar. Ao seguir esse princípio, você evita classes gigantes que são difíceis de entender e manter. Em vez disso, você divide a lógica em componentes menores e mais coesos.
  - Exemplo:
    Suponha que você tenha uma classe "UserService" que é responsável por gerenciar usuários. Essa classe deve se concentrar apenas na lógica relacionada aos usuários, como criar, atualizar, excluir e recuperar informações de usuários. Ela não deve lidar com tarefas adicionais, como autenticação de usuários ou envio de e-mails. Essas responsabilidades devem ser tratadas por outras classes ou módulos separados.

- Open/Closed Principle (Princípio do Aberto/Fechado):

  - Exemplo:
    Digamos que você tenha uma classe "PaymentProcessor" que processa pagamentos. Se você precisar adicionar um novo método de pagamento, em vez de modificar a classe existente para incluir a lógica desse novo método, você pode criar uma nova classe derivada da classe base "PaymentProcessor" e implementar o novo método nessa classe derivada. Dessa forma, você estende o comportamento existente sem alterar o código já testado e funcionando.

- Liskov Substitution Principle (Princípio da Substituição de Liskov):

  - O princípio da Substituição de Liskov estabelece que as classes derivadas devem ser substituíveis por suas classes base, sem afetar a corretude do programa. Isso significa que você deve poder usar uma instância de uma classe derivada em qualquer lugar onde uma instância da classe base seja esperada, sem que isso cause problemas.
  - Exemplo:
    Suponha que você tenha uma classe "Animal" com um método "fazerBarulho()". Agora, você cria classes derivadas como "Cachorro" e "Gato". O princípio da Substituição de Liskov exige que ambas as classes derivadas implementem o método "fazerBarulho()" de forma consistente. Isso significa que quando você substituir uma instância de "Animal" por uma instância de "Cachorro" ou "Gato", o comportamento do método "fazerBarulho()" deve ser coerente com o esperado para um animal.

- Interface Segregation Principle (Princípio da Segregação de Interfaces):

  - O princípio da Segregação de Interfaces estabelece que as interfaces devem ser específicas para cada cliente e não devem impor métodos desnecessários para as classes que as implementam. Isso significa que você deve dividir interfaces grandes e genéricas em interfaces menores e mais específicas, para que as classes implementem apenas o que é necessário.
  - Exemplo:
    Suponha que você tenha uma interface "IContato" com métodos como "enviarEmail()", "enviarSMS()" e "fazerChamada()". Em vez de forçar todas as classes que implementam essa interface a implementar todos esses métodos, você pode criar interfaces mais específicas, como "IEnvioEmail" e "IEnvioSMS", e as classes implementarão apenas as interfaces relevantes para suas funcionalidades.

- Dependency Inversion Principle (Princípio da Inversão de Dependência):

  - O princípio da Inversão de Dependência estabelece que os módulos de alto nível não devem depender dos módulos de baixo nível. Em vez disso, ambos devem depender de abstrações. Isso promove o desacoplamento e facilita a substituição de implementações.
  - Exemplo:
    Em vez de uma classe "UserService" depender diretamente de uma classe "DatabaseService" para acessar o banco de dados, você pode criar uma abstração como uma interface "IDatabaseService". A classe "UserService" dependerá agora da abstração, permitindo que diferentes implementações de serviço de banco de dados, como "MongoDBService" ou PostressService", sejam usadas sem modificar o código do "UserService".

Fontes:

- [SOLID fica FÁCIL com Essas Ilustrações](https://www.youtube.com/watch?v=6SfrO3D4dHM)
- [The S.O.L.I.D Principles in Pictures](https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898)
- [The SOLID Principles of Object-Oriented Programming Explained](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)
