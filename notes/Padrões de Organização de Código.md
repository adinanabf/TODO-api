# Padrões de Organização de Código

Routes/Controllers:

- Responsabilidades:
  - Lidar com as requisições HTTP, mapeando as rotas da aplicação para funções de controle.
  - Recebem as requisições do cliente e determinam qual ação deve ser executada.
  - lidam os dados de entrada e realizam conversões, se necessário.\*
  - hamam as funções de serviço apropriadas para executar a lógica de negócio.
  - Formatam e retornam as respostas HTTP adequadas para o cliente.

Services:

- Responsabilidade:
  - Contêm a lógica de negócio da aplicação.
  - Realizam operações e manipulações de dados específicas para a aplicação.
  - Implementam regras de negócio e validações complexas.
  - Podem chamar funções de repositório para interagir com o banco de dados ou outras fontes de dados.
  - Fornecem abstrações e encapsulamento para a lógica de negócio, facilitando a reutilização e testabilidade.

Repository:

- Responsabilidade:
  - Lidar com a persistência de dados e a interação com o banco de dados.
  - Implementam métodos para realizar operações CRUD (create, read, update, delete) no banco de dados.
  - Abstraem a complexidade das operações de banco de dados, permitindo que as camadas superiores se concentrem na lógica de negócio.
  - Podem fornecer métodos para filtrar, ordenar e pesquisar os dados.
  - Promovem a separação entre a lógica de negócio e a camada de persistência de dados.
