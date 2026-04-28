# 📚 README — Tecnologias do Projeto

> **Gerenciamento de Tarefas** — Documentação das stacks utilizadas no Front-end e no Back-end.

---

## 🖥️ Front-end

### Angular 13
**Framework principal** da aplicação. Responsável por toda a estrutura SPA (Single Page Application), com roteamento, módulos, componentes, serviços e injeção de dependência. Versão 13.1 utilizada.

### TypeScript 4.5
**Linguagem de programação** usada no Angular. Adiciona tipagem estática ao JavaScript, tornando o código mais seguro, legível e fácil de manter.

### Angular Material 13
**Biblioteca de componentes de UI** baseada no Material Design do Google. Utilizada para dialogs (MatDialog), formulários (MatFormField), botões, ícones, selects e outros elementos visuais da interface.

### Angular CDK (Component Dev Kit)
**Kit de primitivas** que suporta funcionalidades avançadas de UI. Usado especificamente para o **drag-and-drop** (`CdkDragDrop`) que permite reordenar departamentos, tarefas e pessoas na tela.

### RxJS 7.4
**Biblioteca de programação reativa**. Utilizada para gerenciar chamadas HTTP assíncronas com `Observable`, `subscribe`, `tap` e operadores de stream em todas as comunicações com a API.

### Angular HttpClient
**Módulo nativo do Angular** para realizar requisições HTTP. Todas as chamadas à API REST (GET, POST, PUT, DELETE) dos serviços de Departamento, Pessoa, Tarefa, Auth e Admin são feitas por ele.

### ngx-toastr 13
**Biblioteca de notificações toast**. Exibe mensagens de sucesso, erro e informação no canto inferior direito da tela após ações como salvar, editar ou remover registros.

### Angular Router
**Módulo de roteamento** do Angular. Gerencia as rotas da aplicação (login de usuário, login de admin, dashboard de usuário, dashboard de admin), além de guards de proteção de rota.

### Route Guards (CanActivate)
**Guardas de rota** implementadas para controle de acesso. `admin.guard.ts` protege rotas administrativas e `usuario.guard.ts` protege as rotas de usuário comum.

### HTTP Interceptors
**Interceptores HTTP** utilizados para duas finalidades:
- `auth.interceptor.ts`: injeta automaticamente o token JWT no header `Authorization` de todas as requisições.
- `loading.interceptor.ts`: controla o estado de carregamento global da aplicação.

### SCSS (CSS Pré-processado)
**Pré-processador de estilos** utilizado em todos os componentes. Permite uso de variáveis, aninhamento de seletores e melhor organização do CSS.

### Vercel
**Plataforma de deploy** do Front-end. O arquivo `vercel.json` na raiz do projeto configura o deploy contínuo da aplicação Angular em produção.

---

## ⚙️ Back-end

### Java 11+
**Linguagem de programação** principal do Back-end. Base de toda a lógica de negócio, controllers, services e repositories da aplicação.

### Spring Boot 2.5.4
**Framework principal** do Back-end. Responsável pela inicialização da aplicação, autoconfiguração, injeção de dependência, criação de servidores embutidos e orquestração de todos os módulos Spring.

### Spring Web (spring-boot-starter-web)
**Módulo Spring** que habilita a criação de APIs REST. Todos os controllers (`DepartamentoController`, `TarefaController`, `PessoaController`, etc.) usam suas anotações (`@RestController`, `@GetMapping`, `@PostMapping`, `@DeleteMapping`, `@PutMapping`, `@PathVariable`, `@RequestBody`).

### Spring Data JPA (spring-boot-starter-data-jpa)
**Módulo Spring** para persistência de dados. Abstrai o acesso ao banco de dados via repositórios (`DepartamentoRepository`, `PessoaRepository`, etc.), dispensando SQL manual para operações comuns.

### Hibernate 5.6
**ORM (Object-Relational Mapping)** usado internamente pelo Spring Data JPA. Faz o mapeamento entre as entidades Java (`Departamento`, `Pessoa`, `Tarefa`) e as tabelas do banco de dados.

### PostgreSQL
**Banco de dados relacional** usado em produção. Armazena todos os dados do sistema: departamentos, pessoas, tarefas, notificações e mensagens.

### H2 Database
**Banco de dados em memória** utilizado para testes e ambiente de desenvolvimento local. Permite rodar a aplicação sem precisar de uma instalação de banco de dados.

### Spring Security (spring-boot-starter-security)
**Módulo de segurança** da aplicação. Configura a autenticação, autorização e o filtro de CORS global (`SecurityConfig`). Protege os endpoints da API contra acessos não autorizados.

### Spring OAuth2 Resource Server
**Módulo de autenticação por token**. Habilita a validação de tokens JWT nas requisições recebidas pelo Back-end, garantindo que apenas usuários autenticados acessem os recursos protegidos.

### Lombok
**Biblioteca de redução de boilerplate** Java. Usada em toda a aplicação com anotações como `@RequiredArgsConstructor` para gerar construtores automaticamente, eliminando código repetitivo.

### Spring Scheduler (`@Scheduled`)
**Módulo de agendamento de tarefas**. O `LembreteTarefaScheduler` usa `@Scheduled` para executar verificações periódicas e disparar lembretes/notificações de tarefas com prazo próximo.

### GlobalExceptionHandler
**Handler global de exceções** (`@ControllerAdvice`). Centraliza o tratamento de erros da API, retornando respostas padronizadas com status HTTP adequados (400, 404, 500, etc.).

### Maven
**Ferramenta de build e gerenciamento de dependências** do Back-end. O `pom.xml` declara todas as dependências, plugins e configurações de compilação do projeto Java.

### Render
**Plataforma de deploy** do Back-end. A aplicação Spring Boot é hospedada em `https://desafio-backend-java.onrender.com`, onde recebe as requisições do Front-end em produção.

---

## 🔗 Comunicação Front-end ↔ Back-end

| Aspecto | Detalhe |
|---|---|
| Protocolo | REST (HTTP/HTTPS) |
| Formato de dados | JSON |
| Autenticação | JWT Bearer Token via Header `Authorization` |
| CORS | Configurado globalmente no `SecurityConfig` do Back-end |
| URL de produção (API) | `https://desafio-backend-java.onrender.com` |
| URL de produção (Front) | `https://gerenciamento-tarefas-angular.vercel.app` |

---

## 🗂️ Estrutura Resumida das Stacks

```
Front-end (Angular / Vercel)
├── Angular 13 + TypeScript        → Framework e linguagem
├── Angular Material + CDK         → UI Components e Drag & Drop
├── RxJS                           → Programação reativa / HTTP
├── ngx-toastr                     → Notificações visuais
├── HTTP Interceptors               → JWT e Loading global
└── SCSS                           → Estilização

Back-end (Spring Boot / Render)
├── Java + Spring Boot 2.5.4       → Framework e linguagem
├── Spring Web                     → API REST
├── Spring Data JPA + Hibernate    → Persistência ORM
├── Spring Security + OAuth2 JWT   → Autenticação e autorização
├── PostgreSQL / H2                → Banco de dados
├── Lombok                         → Redução de boilerplate
├── Spring Scheduler               → Agendamento de lembretes
└── Maven                          → Build e dependências
```
