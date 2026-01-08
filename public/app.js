class AdminPanel {
  constructor() {
    // Base da API conforme seu print do Swagger
    this.apiBase = 'https://localhost:7020/api';
    this.init();
  }

  init() {
    this.testConnection();
    this.setupEventListeners();
  }

  // Testa se a API está respondendo
  async testConnection() {
    console.log('🔗 Testando conexão com API...');
    try {
      const response = await fetch(`${this.apiBase}/Usuarios`, { method: 'GET' });
      if (response.ok || response.status === 400) { 
        // 400 ainda indica que o servidor respondeu (conexão ok)
        console.log('✅ API detectada!');
        this.showView('usuarios');
        this.loadUsuarios();
      }
    } catch (err) {
      console.error('❌ Erro ao conectar com API:', err.message);
    }
  }

  setupEventListeners() {
    // Alternância de Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.showView(view);
        this.loadViewData(view);
      });
    });

    // Filtros e buscas
    document.getElementById('btnSearch')?.addEventListener('click', () => this.searchUsuarios());
    document.getElementById('btnClearSearch')?.addEventListener('click', () => {
      document.getElementById('searchUser').value = '';
      this.loadUsuarios();
    });

    // Botões de "Novo"
    document.getElementById('btnNewUser')?.addEventListener('click', () => this.openUserForm());
    document.getElementById('btnNewPizza')?.addEventListener('click', () => this.openPizzaForm());
    document.getElementById('btnNewPedido')?.addEventListener('click', () => this.openPedidoForm());

    // Login
    document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));

    // Fechar Modal
    document.querySelector('.modal-close')?.addEventListener('click', () => this.closeModal());
  }

  showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewName)?.classList.add('active');
  }

  loadViewData(view) {
    switch(view) {
      case 'usuarios': this.loadUsuarios(); break;
      case 'pizzas': this.loadPizzas(); break;
      case 'pedidos': this.loadPedidos(); break;
    }
  }

  // Função genérica para chamadas API
  async api(method, path, data = null) {
    const url = this.apiBase + path;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${res.status}`);
      }
      return res.status === 204 ? null : res.json();
    } catch (err) {
      console.error(`[API Error] ${method} ${url}:`, err.message);
      throw err;
    }
  }

  // ================= SEÇÃO: USUÁRIOS =================

  async loadUsuarios() {
    const container = document.getElementById('usuariosTable');
    try {
      const usuarios = await this.api('GET', '/Usuarios'); // Rota: /api/Usuarios
      this.renderUsuariosTable(usuarios);
    } catch (err) {
      container.innerHTML = `<p class="error">Erro ao carregar: ${err.message}</p>`;
    }
  }

  async searchUsuarios() {
    const query = document.getElementById('searchUser').value.trim();
    if (!query) return this.loadUsuarios();
    try {
      // Rota correta: /api/Usuarios/BuscarPorNome
      const result = await this.api('GET', `/Usuarios/BuscarPorNome?nome=${encodeURIComponent(query)}`);
      this.renderUsuariosTable(Array.isArray(result) ? result : [result]);
    } catch (err) {
      alert("Usuário não encontrado.");
    }
  }

  async deleteUsuario(id) {
    if (!confirm('Deseja excluir este usuário?')) return;
    try {
      await this.api('DELETE', `/Usuarios/${id}`); // Rota: /api/Usuarios/{id}
      this.loadUsuarios();
    } catch (err) { alert(err.message); }
  }

  renderUsuariosTable(usuarios) {
    const container = document.getElementById('usuariosTable');
    if (!usuarios || usuarios.length === 0) {
      container.innerHTML = '<div class="empty">Nenhum usuário cadastrado.</div>';
      return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Ações</th></tr></thead><tbody>';
    usuarios.forEach(u => {
      html += `<tr>
        <td>${u.id || u.Id}</td>
        <td>${u.nome || u.Nome}</td>
        <td>${u.email || u.Email}</td>
        <td>
          <button class="btn-edit" onclick="panel.openUserForm(${u.id || u.Id})">Editar</button>
          <button class="btn-danger" onclick="panel.deleteUsuario(${u.id || u.Id})">Excluir</button>
        </td>
      </tr>`;
    });
    container.innerHTML = html + '</tbody></table>';
  }

  // ================= SEÇÃO: PIZZAS =================

  async loadPizzas() {
    const container = document.getElementById('pizzasTable');
    try {
      // Rota correta conforme seu print: /api/Pedido/ListaDePizzas
      const pizzas = await this.api('GET', '/Pedido/ListaDePizzas');
      this.renderPizzasTable(pizzas);
    } catch (err) {
      container.innerHTML = `<p>Erro ao carregar pizzas.</p>`;
    }
  }

  renderPizzasTable(pizzas) {
    const container = document.getElementById('pizzasTable');
    let html = '<table><thead><tr><th>Nome</th><th>Preço</th><th>Tamanho</th></tr></thead><tbody>';
    pizzas.forEach(p => {
      html += `<tr>
        <td>${p.nome || p.Nome}</td>
        <td>R$ ${p.preco || p.Preco}</td>
        <td>${p.tamanho || p.Tamanho}</td>
      </tr>`;
    });
    container.innerHTML = html + '</tbody></table>';
  }

  // ================= SEÇÃO: PEDIDOS =================

  async loadPedidos() {
    try {
      // Rota correta conforme seu print: /api/Pedido/Selecionar
      const pedidos = await this.api('GET', '/Pedido/Selecionar');
      this.renderPedidosTable(pedidos);
    } catch (err) {
      console.error("Erro ao carregar pedidos", err);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.senha.value;
    try {
      // Rota correta conforme seu print: /api/Usuarios/Login
      const user = await this.api('GET', `/Usuarios/Login?email=${email}&senha=${senha}`);
      alert(`Sucesso! Logado como ${user.nome || user.Nome}`);
    } catch (err) {
      alert("Falha no login: verifique credenciais.");
    }
  }

  closeModal() {
    document.getElementById('modal').classList.remove('active');
  }
}

// Inicializa o painel
const panel = new AdminPanel();