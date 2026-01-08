# 🍕 Painel Administrativo - Pizzaria

Painel administrativo profissional para gerenciar usuários, pizzas e pedidos da pizzaria.

## 🚀 Instalação e Uso

### Requisitos
- Node.js v14+ instalado
- API rodando em `https://localhost:7020`

### Passo 1: Instalar Dependências

Abra o terminal na pasta raiz do projeto e execute:

```bash
npm install
```

Isso vai instalar Express e Axios.

### Passo 2: Iniciar o Servidor

```bash
npm start
```

Você deve ver:
```
🍕 Painel Administrativo Pizzaria
================================
📱 Painel rodando em: http://localhost:3000
🔗 API Backend: https://localhost:7020
================================
```

### Passo 3: Acessar o Painel

Abra seu navegador e vá para:

```
http://localhost:3000
```

## 📋 Funcionalidades

- **Usuários**: Listar, criar, editar, deletar e buscar por nome
- **Pizzas**: Listar, criar, editar e deletar
- **Pedidos**: Listar, criar e deletar
- **Login**: Autenticar usuários na API

## 🔧 Como Funciona

O servidor Node.js faz um **proxy** para a API:

```
Navegador → http://localhost:3000/api/* → https://localhost:7020/*
```

Isso evita problemas de CORS e SSL/certificados.

## ⚠️ Troubleshooting

### "Failed to fetch"
- Certifique-se que a API em `https://localhost:7020` está rodando
- Abra o Console (F12) para ver mensagens de erro detalhadas

### Dependências não encontradas
```bash
npm install
```

### Porta 3000 já em uso
Mude para outra porta editando `server.js`:
```javascript
app.listen(5000, () => {
  // mude para 5000
```

## 📁 Estrutura

```
.
├── server.js           # Servidor Node.js + Proxy
├── package.json        # Dependências
└── public/
    ├── index.html      # Interface
    ├── style.css       # Estilos
    ├── app.js          # Lógica JavaScript
    └── README.md       # Este arquivo
```

## 🛠️ Desenvolvimento

Para desenvolver com hot reload, instale `nodemon`:

```bash
npm install -D nodemon
```

Depois mude no `package.json`:
```json
"dev": "nodemon server.js"
```

E rode:
```bash
npm run dev
```

---

**Desenvolvido com ❤️ para gerenciar sua pizzaria!**
