// perfil.js - Sistema de Perfil do Usuário

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    verificarLogin();
    
    // Carregar dados do usuário
    carregarDadosUsuario();
    
    // Configurar event listeners
    setupEventListeners();
});

function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/WorkNet/login.html';
        return;
    }
}

function carregarDadosUsuario() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogado);
    
    // Preencher informações básicas
    document.getElementById('perfil-nome').textContent = usuario.nome;
    document.getElementById('perfil-tipo').textContent = usuario.tipoUsuario === 'prestador' ? 'Prestador de Serviços' : 'Cliente';
    
    // Criar iniciais para o avatar
    const iniciais = usuario.nome.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    document.getElementById('avatar-iniciais').textContent = iniciais;
    
    // Data de cadastro
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const dadosCompletos = usuarios.find(u => u.email === usuario.email);
    
    if (dadosCompletos && dadosCompletos.dataCadastro) {
        const data = new Date(dadosCompletos.dataCadastro);
        const dataFormatada = data.toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('perfil-data').textContent = dataFormatada;
        document.getElementById('info-data-cadastro').textContent = dataFormatada;
    }
    
    // Preencher informações detalhadas
    document.getElementById('info-email').textContent = usuario.email;
    document.getElementById('info-cpf').textContent = dadosCompletos ? dadosCompletos.cpf : 'Não informado';
    document.getElementById('info-tipo-usuario').textContent = usuario.tipoUsuario === 'prestador' ? 'Prestador de Serviços' : 'Cliente';
    
    // Mostrar/ocultar seções específicas para prestadores
    if (usuario.tipoUsuario === 'prestador') {
        document.getElementById('card-acoes-prestador').style.display = 'block';
        document.getElementById('card-meus-servicos').style.display = 'block';
        carregarServicosUsuario(usuario.email);
    }
    
    // Carregar estatísticas
    carregarEstatisticas(usuario.email);
}

function carregarServicosUsuario(emailUsuario) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Encontrar o nome do usuário
    const usuario = usuarios.find(u => u.email === emailUsuario);
    const nomeUsuario = usuario ? usuario.nome : '';
    
    // Filtrar serviços do usuário
    const servicosUsuario = servicos.filter(s => s.autor === nomeUsuario);
    
    const listaServicos = document.getElementById('servicos-lista');
    
    if (servicosUsuario.length === 0) {
        listaServicos.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #64748b;">
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">📋 Nenhum serviço cadastrado</p>
                <p style="font-size: 0.9rem;">Clique em "Cadastrar Serviço" para adicionar seu primeiro serviço.</p>
            </div>
        `;
        return;
    }
    
    listaServicos.innerHTML = servicosUsuario.map(servico => `
        <div class="servico-item" data-id="${servico.id}">
            <div class="servico-info">
                <h3>${servico.titulo}</h3>
                <p>${servico.descricao}</p>
                <span style="color: #10b981; font-weight: 600;">R$ ${servico.preco.toFixed(2)}</span>
            </div>
            <div class="servico-acoes">
                <button class="btn-servico btn-editar-servico" onclick="editarServico(${servico.id})">
                    ✏️ Editar
                </button>
                <button class="btn-servico btn-excluir-servico" onclick="excluirServico(${servico.id})">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function carregarEstatisticas(emailUsuario) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const usuario = usuarios.find(u => u.email === emailUsuario);
    const nomeUsuario = usuario ? usuario.nome : '';
    
    // Contar serviços do usuário
    const totalServicos = servicos.filter(s => s.autor === nomeUsuario).length;
    
    document.getElementById('stat-servicos').textContent = totalServicos;
    document.getElementById('stat-avaliacoes').textContent = Math.floor(Math.random() * 50); // Simulado
    document.getElementById('stat-contratos').textContent = Math.floor(Math.random() * 100); // Simulado
}

function setupEventListeners() {
    // Botão de sair
    document.getElementById('botao-sair').addEventListener('click', logout);
    
    // Botão de perfil (recarregar página)
    document.getElementById('botao-perfil').addEventListener('click', () => {
        window.location.reload();
    });
    
    // Botão cadastrar serviço
    const btnCadastrarServico = document.getElementById('btn-cadastrar-servico');
    if (btnCadastrarServico) {
        btnCadastrarServico.addEventListener('click', () => {
            window.location.href = '/WorkNet/cadastro_servico.html';
        });
    }
    
    // Botão meus serviços
    const btnMeusServicos = document.getElementById('btn-meus-servicos');
    if (btnMeusServicos) {
        btnMeusServicos.addEventListener('click', () => {
            document.getElementById('card-meus-servicos').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Botão estatísticas
    const btnEstatisticas = document.getElementById('btn-estatisticas');
    if (btnEstatisticas) {
        btnEstatisticas.addEventListener('click', () => {
            alert('Funcionalidade de estatísticas em desenvolvimento!');
        });
    }
    
    // Botão alterar senha
    document.getElementById('btn-alterar-senha').addEventListener('click', alterarSenha);
    
    // Botão notificações
    document.getElementById('btn-notificacoes').addEventListener('click', () => {
        alert('Funcionalidade de notificações em desenvolvimento!');
    });
    
    // Botão excluir conta
    document.getElementById('btn-excluir-conta').addEventListener('click', excluirConta);
    
    // Botão editar informações
    document.getElementById('btn-editar-info').addEventListener('click', () => {
        alert('Funcionalidade de edição em desenvolvimento!');
    });
}

function editarServico(id) {
    alert(`Funcionalidade de editar serviço ${id} em desenvolvimento!`);
    // Futuramente: redirecionar para página de edição ou abrir modal
}

function excluirServico(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
        return;
    }
    
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    servicos = servicos.filter(s => s.id !== id);
    localStorage.setItem('servicos', JSON.stringify(servicos));
    
    alert('Serviço excluído com sucesso!');
    
    // Recarregar a lista
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogado);
    carregarServicosUsuario(usuario.email);
    carregarEstatisticas(usuario.email);
}

function alterarSenha() {
    const senhaAtual = prompt('Digite sua senha atual:');
    if (!senhaAtual) return;
    
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogado);
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioCompleto = usuarios.find(u => u.email === usuario.email);
    
    if (!usuarioCompleto || usuarioCompleto.senha !== senhaAtual) {
        alert('Senha atual incorreta!');
        return;
    }
    
    const novaSenha = prompt('Digite a nova senha (mínimo 6 caracteres):');
    if (!novaSenha || novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    const confirmarSenha = prompt('Confirme a nova senha:');
    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }
    
    // Atualizar senha
    usuarioCompleto.senha = novaSenha;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Senha alterada com sucesso!');
}

function excluirConta() {
    const confirmacao = prompt('Esta ação é irreversível! Digite "EXCLUIR" para confirmar:');
    
    if (confirmacao !== 'EXCLUIR') {
        alert('Exclusão cancelada.');
        return;
    }
    
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogado);
    
    // Remover usuário da lista
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.filter(u => u.email !== usuario.email);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Remover serviços do usuário
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    servicos = servicos.filter(s => s.autor !== usuario.nome);
    localStorage.setItem('servicos', JSON.stringify(servicos));
    
    // Fazer logout
    localStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('usuarioLogado');
    
    alert('Conta excluída com sucesso. Você será redirecionado para a página inicial.');
    window.location.href = '/WorkNet/index.html';
}

function logout() {
    const confirmar = confirm('Deseja realmente sair?');
    if (confirmar) {
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('usuarioLogado');
        alert('Logout realizado com sucesso!');
        window.location.href = '/WorkNet/login.html';
    }
}

// Tornar funções globais
window.editarServico = editarServico;
window.excluirServico = excluirServico;