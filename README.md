# To Do List / Plataforma de Tarefas

## 📋 Sumário
- 1. [Descrição Geral](#-descrição-geral)
- 2. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- 3. [Estrutura do Projeto](#-estrutura-do-projeto)
- 4. [Banco de Dados](#-modelagem-do-banco-de-dados)
- 5. [Funcionalidades](#-funcionalidades)
- 7. [Instalação e Execução](#-instalação-e-execução)
- 8. [Rotas da API](#-rotas-da-api)
- 9. [Segurança Implementada](#-segurança-implementada)
- 10. [Fluxo de Uso](#-fluxo-de-uso)

---

## Descrição Geral

Aplicação Web completa de gerenciamento de tarefas (To-Do List), com sistema de registro e autentificação de usuários. O sistema atua de forma intuitiva, permitindo que os usuários gerenciem as próprias tarefas e protejam elas através de seus respectivos cadastro.

### Objetivo
Ser uma plataforma onde cada usuário seja capaz de: 
- Criar sua própria conta;
- Gerenciar suas tarefas;
- Manter tarefas privadas e acessíveis apenas com login;
- Ter uma experiência fluída e responsiva.

---

## Módulos Utilizados

### Backend
- **Node.js** + **Express** - Servidor e rotas
- **Sequelize** e **SQLite** - Banco de Dados
- **JWT** - Autenticação segura
- **Bcrypt** - Hash de senhas
- **Express-validator** - Validação de inputs
- **Cors** - Liberação de requisições

### Frontend
- **React** - Biblioteca para UI
- **React Router DOM** - Navegação entre páginas
- **Axios** - Requisições HTTP
- **CSS** - Estilização personalizada

---

## Estrutura do Projeto
```text
task-manager/
├── back-end/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── taskController.js # Lógica das tarefas
│ │ │ └── userController.js # Lógica de usuários
│ │ │
│ │ ├── models/
│ │ │ ├── Task.js # Modelo de tarefa
│ │ │ └── User.js # Modelo de usuário
│ │ │
│ │ ├── routes/
│ │ │ ├── taskRoutes.js # Rotas de tarefas
│ │ │ └── userRoutes.js # Rotas de usuários
│ │ │
│ │ ├── middlewares/
│ │ │ └── Authentication.js # Middleware JWT
│ │ │
│ │ ├── database.js # Configuração SQLite
│ │ └── App.js # Configuração principal
│ │
│ ├── server.js # Entry point
│ └── package.json
│
└── front-end/
├── public/
└── src/
├── components/
│ ├── AddTask/ # Form de adicionar tarefa
│ ├── Button/ # Botão reutilizável
│ ├── Header/ # Cabeçalho
│ ├── Register/ # Telas de autenticação
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ ├── SubmitionBar/ # Input reutilizável
│ └── Tasks/ # Lista de tarefas
│ └── Task/ # Tarefa individual
│  
├── App.jsx # Componente principal
├── App.css # Estilos globais
└── index.js # Entry point React
```
---

## Banco de Dados

### Tabela: users
| Campo    | Tipo     | Restrições          | Descrição           |
|----------|----------|---------------------|---------------------|
| id       | INTEGER  | PK, Auto Increment  | ID único do usuário |
| nome     | STRING   | NOT NULL            | Nome do usuário     |
| email    | STRING   | UNIQUE, NOT NULL    | Email para login    |
| senha    | STRING   | NOT NULL            | Hash da senha       |
| createdAt| DATE     | Auto                | Data de criação     |
| updatedAt| DATE     | Auto                | Data de atualização |

### Tabela: tasks
| Campo       | Tipo      | Restrições          | Descrição                |
|-------------|-----------|---------------------|--------------------------|
| id          | INTEGER   | PK, Auto Increment  | ID único da tarefa       |
| userId      | INTEGER   | FK → users.id       | ID do usuário dono       |
| title       | STRING    | NOT NULL            | Título da tarefa         |
| description | STRING    | NULLABLE            | Descrição detalhada      |
| completed   | BOOLEAN   | DEFAULT false       | Status da tarefa         |
| createdAt   | DATE      | Auto                | Data de criação          |
| updatedAt   | DATE      | Auto                | Data de atualização      |

### Relacionamentos
- **Usuário 1 : N Tarefas** - Um usuário pode ter várias tarefas
- **Tarefa N : 1 Usuário** - Cada tarefa pertence a um único usuário

---

## Funcionalidades

### Usuários
- [x] Cadastro com nome, email e senha
- [x] Validação de email único
- [x] Senha com mínimo 6 caracteres
- [x] Login e Logout com geração de token JWT
- [x] Hash de senha com bcrypt

### Tarefas
- [x] **Criar**: Adicionar nova tarefa com título
- [x] **Listar**: Visualizar todas as tarefas do usuário
- [x] **Atualizar**: 
  - Marcar/desmarcar como concluída
  - Editar descrição
- [x] **Deletar**: Remover tarefa permanentemente

---

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager
```
#### 2. Backend
```bash
cd back-end
npm install
npm start
```
O servidor rodará na porta 3001.

#### 3. Frontend
```bash
cd front-end
npm install
npm start
```
A aplicação abrirá em http:/localhost:3000

## Rotas da API

### Usuários (`/users`)

| Método | Rota | Autenticação | Descrição | Corpo da Requisição | Resposta (200) |
|--------|------|--------------|-----------|---------------------|----------------|
| POST | `/registrar` | ❌ | Cadastrar usuário | `{nome, email, senha}` | `{token, user}` |
| POST | `/login` | ❌ | Fazer login | `{email, senha}` | `{token, user}` |
| POST | `/buscar-id` | ✅ | Buscar dados do usuário | - | `{user}` |

### Tarefas (`/tasks`)

| Método | Rota | Autenticação | Descrição | Corpo da Requisição | Resposta |
|--------|------|--------------|-----------|---------------------|----------|
| GET | `/` | ✅ | Listar tarefas do usuário | - | `[Task]` |
| POST | `/` | ✅ | Criar nova tarefa | `{title, description?}` | `Task` |
| PUT | `/:taskId` | ✅ | Atualizar tarefa | `{title?, description?, completed?}` | `Task` |
| DELETE | `/:taskId` | ✅ | Deletar tarefa | - | `{message}` |
| PATCH | `/:taskId/toggle` | ✅ | Alternar status | - | `Task` |

### Exemplo de Requisição

#### Registro de usuário
```bash
POST /users/registrar
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

#### Login
```bash
POST /users/login
{
  "email": "joao@email.com",
  "senha": "123456"
}
```
Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

## Segurança Implementada
### Hash de Senhas
```javascript
// models/User.js
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
});
```

### Autenticação JWT
```javascript
// middlewares/Authentication.js
jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) return respond.status(403);
    request.user = user;
    next();
});
```

### Proteção de Rotas
```javascript
// routes/taskRoutes.js
router.get('/', authenticateToken, taskController.taskUser);
```

### Isolamento de Dados
```javascript
// controllers/taskController.js
const userId = request.user.userId;
const tasks = await Task.findAll({ where: { userId } });
```

### Sanitização XSS
```javascript
// controllers/taskController.js
const sanitizedTitle = title.replace(/[<>]/g, '');
```

### Tratamento de Erros
```javascript
// controllers/userController.js
try {
    // ...
} catch (error) {
    respond.status(500).json({ 
        message: "Erro interno do servidor"
    });
}
```

## Fluxo de Uso
### Do Usuário:
```text
1. Acessa a página inicial
2. Escolhe entre "Registrar-se" ou "Login"
3. Se registrar: Preenche nome, email e senha
   / Se login: Informa email e senha
4. Após autenticação, é redirecionado para /tasks
5. Visualiza suas tarefas (ou lista vazia)
6. Pode:
   Adicionar nova tarefa
   Clicar no título para marcar/desmarcar como concluída
   Clicar na descrição para editá-la
   Clicar no "X" para deletar
   Clicar em "Sair" para fazer logout
```
## Dos Dados:
```text
Frontend (React) 
    ↓ (Requisição HTTP + Token)
Backend (Express) 
    ↓ (Middleware de autenticação)
Controller (Validação + Lógica) 
    ↓ (Query)
Banco de Dados (SQLite) 
    ↓ (Resposta)
Frontend (Atualiza estado)
```
---

## Autor

**Breno Martins** - [GitHub](https://github.com/bg-br)

---

## Agradecimentos

- Pela oportunidade de participação do projeto
- Documentação do React e Node.js

---
