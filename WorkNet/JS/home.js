// home.js - Sistema de Feed de Serviços com Permissões

// Serviços iniciais para a seção "Divulgação de Serviços"
let servicos = [
    {
        id: 1,
        titulo: 'João - Pedreiro',
        subtitulo: 'Pedreiro',
        descricao: 'Serviços de construção e reforma com qualidade garantida.',
        preco: 150.00,
        autor: 'João Silva',
        imagem: '/WorkNet/img/pedreiro.png'
    },
    {
        id: 2,
        titulo: 'Paulo - Eletricista Profissional',
        subtitulo: 'Eletricista',
        descricao: 'Instalações elétricas residenciais e comerciais.',
        preco: 120.00,
        autor: 'Paulo Santos',
        imagem: '/WorkNet/img/eletricista.jpeg'
    },
    {
        id: 3,
        titulo: 'Lucas - Pintor',
        subtitulo: 'Pintor',
        descricao: 'Pintura residencial e comercial com acabamento perfeito.',
        preco: 100.00,
        autor: 'Lucas Costa',
        imagem: '/WorkNet/img/pintor.png'
    },
    {
        id: 4,
        titulo: 'Mateus - Instalador de Movéis',
        subtitulo: 'Instalador',
        descricao: 'Instalador de movéis gerais, armarios, mesas.',
        preco: 80.00,
        autor: 'Mateus Lima',
        imagem: '/Worknet/img/moveis.jpeg'
    }
    
];

let termoBusca = '';
let usuarioAtual = null;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    verificarLogin();
    
    // Carregar serviços do localStorage se existirem
    carregarServicos();
    
    // Renderizar serviços iniciais
    renderizarServicos();
    
    // Event Listeners
    setupEventListeners();
    
    // Configurar permissões
    configurarPermissoes();
});

function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/WorkNet/login.html';
        return;
    }
    
    usuarioAtual = JSON.parse(usuarioLogado);
}

function configurarPermissoes() {
    const btnAdicionarServico = document.getElementById('botao-adicionar-servico');
    
    // Verificar se o usuário é prestador
    if (usuarioAtual && usuarioAtual.tipoUsuario === 'prestador') {
        // Prestador: mostrar botão de adicionar serviço
        if (btnAdicionarServico) {
            btnAdicionarServico.style.display = 'block';
        }
    } else {
        // Cliente: ocultar botão de adicionar serviço
        if (btnAdicionarServico) {
            btnAdicionarServico.style.display = 'none';
        }
    }
}

function carregarServicos() {
    const servicosStorage = localStorage.getItem('servicos');
    if (servicosStorage) {
        servicos = JSON.parse(servicosStorage);
    }
}

function salvarServicos() {
    localStorage.setItem('servicos', JSON.stringify(servicos));
}

function setupEventListeners() {
    // Botão de logout
    const logoutBtn = document.getElementById('botao-sair');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Botão de perfil
    const perfilBtn = document.getElementById('botao-conta');
    if (perfilBtn) {
        perfilBtn.addEventListener('click', () => {
            window.location.href = '/WorkNet/perfil.html';
        });
    }
    
    // Formulário de busca
    const searchForm = document.getElementById('formulario-pesquisa');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            realizarBusca();
        });
    }
    
    // Input de busca em tempo real
    const searchInput = document.getElementById('campo-pesquisa');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value === '') {
                termoBusca = '';
                renderizarServicos();
            }
        });
    }
    
    // Cards de categoria
    const categoryCards = document.querySelectorAll('.cartao-categoria');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoria = this.dataset.categoria;
            if (searchInput) {
                searchInput.value = categoria;
            }
            termoBusca = categoria.toLowerCase();
            renderizarServicos();
            
            // Scroll para a seção de divulgação
            const serviceListing = document.querySelector('.secao-divulgacao-servicos');
            if (serviceListing) {
                serviceListing.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Modal de adicionar serviço (apenas para prestadores)
    const addServiceBtn = document.getElementById('botao-adicionar-servico');
    if (addServiceBtn && usuarioAtual && usuarioAtual.tipoUsuario === 'prestador') {
        addServiceBtn.addEventListener('click', abrirModal);
    }
    
    const closeModal = document.getElementById('fechar-modal');
    if (closeModal) {
        closeModal.addEventListener('click', fecharModal);
    }
    
    const cancelModal = document.getElementById('cancelar-modal');
    if (cancelModal) {
        cancelModal.addEventListener('click', fecharModal);
    }
    
    // Formulário de adicionar serviço
    const serviceForm = document.getElementById('formulario-servico');
    if (serviceForm) {
        serviceForm.addEventListener('submit', adicionarServico);
    }
    
    // Fechar modal ao clicar fora
    const serviceModal = document.getElementById('modal-servico');
    if (serviceModal) {
        serviceModal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal();
            }
        });
    }
}

function realizarBusca() {
    const searchInput = document.getElementById('campo-pesquisa');
    if (searchInput) {
        termoBusca = searchInput.value.toLowerCase().trim();
    }
    renderizarServicos();
    
    // Scroll para a seção de divulgação se houver busca
    if (termoBusca) {
        const serviceListing = document.querySelector('.secao-divulgacao-servicos');
        if (serviceListing) {
            serviceListing.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function renderizarServicos() {
    const grid = document.getElementById('grade-servicos');
    const noResults = document.getElementById('sem-resultados');
    
    if (!grid) return;
    
    // Filtrar serviços por busca
    let servicosFiltrados = servicos;
    
    if (termoBusca) {
        servicosFiltrados = servicosFiltrados.filter(s => 
            s.titulo.toLowerCase().includes(termoBusca) ||
            s.subtitulo.toLowerCase().includes(termoBusca) ||
            s.descricao.toLowerCase().includes(termoBusca) ||
            s.autor.toLowerCase().includes(termoBusca)
        );
    }
    
    // Mostrar ou ocultar mensagem de "sem resultados"
    if (servicosFiltrados.length === 0) {
        if (noResults) {
            noResults.style.display = 'block';
        }
        grid.innerHTML = '';
        return;
    } else {
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
    
    // Renderizar cards
    grid.innerHTML = servicosFiltrados.map(servico => `
        <figure class="cartao-divulgacao" data-servico-id="${servico.id}" style="cursor: pointer;">
            <img src="${servico.imagem}" alt="${servico.titulo}" onerror="this.src='/WorkNet/img/default-service.jpg'">
            <figcaption>
                <header>
                    <h3>${servico.titulo}</h3>
                    <p style="color: #64748b; font-size: 0.9rem; margin-top: 0.25rem;">${servico.subtitulo}</p>
                </header>
                <p style="color: #475569; margin: 1rem 0;">${servico.descricao}</p>
                <div class = "footer_js"; style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span style="color: white; font-weight: 700; font-size: 1.1rem;">R$ ${servico.preco.toFixed(2)}</span>
                </div>
            </figcaption>
        </figure>
    `).join('');
    
    // Adicionar event listeners aos cards
    adicionarEventListenersCards();
}

function adicionarEventListenersCards() {
    const cards = document.querySelectorAll('.cartao-divulgacao');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const servicoId = parseInt(this.dataset.servicoId);
            navegarParaServico(servicoId);
        });
    });
    
    // Também adicionar aos cards de destaque
    const featuredCards = document.querySelectorAll('.item-servico');
    featuredCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            // Para os cards em destaque, vamos usar os primeiros serviços
            if (servicos.length > index) {
                navegarParaServico(servicos[index].id);
            } else {
                // Se não houver serviço correspondente, navega para o primeiro
                navegarParaServico(servicos[0]?.id || 1);
            }
        });
    });
}

function navegarParaServico(servicoId) {
    // Encontrar o serviço pelo ID
    const servico = servicos.find(s => s.id === servicoId);
    
    if (servico) {
        // Salvar o serviço selecionado no localStorage
        localStorage.setItem('servicoSelecionado', JSON.stringify(servico));
        
        // Redirecionar para a tela do serviço
        window.location.href = '/WorkNet/tela_do_serviço.html';
    }
}

function abrirModal() {
    // Verificar se é prestador
    if (!usuarioAtual || usuarioAtual.tipoUsuario !== 'prestador') {
        alert('Apenas prestadores de serviços podem adicionar serviços!');
        return;
    }
    
    const modal = document.getElementById('modal-servico');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharModal() {
    const modal = document.getElementById('modal-servico');
    const form = document.getElementById('formulario-servico');
    
    if (modal) {
        modal.style.display = 'none';
    }
    if (form) {
        form.reset();
    }
}

function adicionarServico(e) {
    e.preventDefault();
    
    // Verificar se é prestador
    if (!usuarioAtual || usuarioAtual.tipoUsuario !== 'prestador') {
        alert('Apenas prestadores de serviços podem adicionar serviços!');
        return;
    }
    
    const tituloInput = document.getElementById('nome-servico');
    const categoriaInput = document.getElementById('categoria-servico');
    const descricaoInput = document.getElementById('descricao-servico');
    const precoInput = document.getElementById('valor-servico');
    
    if (!tituloInput || !categoriaInput || !descricaoInput || !precoInput) {
        alert('Erro ao acessar os campos do formulário!');
        return;
    }
    
    const novoServico = {
        id: servicos.length > 0 ? Math.max(...servicos.map(s => s.id)) + 1 : 1,
        titulo: tituloInput.value,
        subtitulo: getCategoriaTexto(categoriaInput.value),
        descricao: descricaoInput.value,
        preco: parseFloat(precoInput.value),
        autor: usuarioAtual.nome,
        imagem: '/WorkNet/img/default-service.jpg'
    };
    
    servicos.unshift(novoServico);
    salvarServicos();
    
    alert('Serviço publicado com sucesso!');
    fecharModal();
    renderizarServicos();
}

function getCategoriaTexto(categoria) {
    const categorias = {
        'tecnologia': '💻 Tecnologia',
        'design': '🎨 Design',
        'educacao': '📚 Educação',
        'saude': '🏥 Saúde',
        'construcao': '🔨 Construção',
        'beleza': '💄 Beleza',
        'alimentacao': '🍔 Alimentação'
    };
    return categorias[categoria] || categoria;
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
window.logout = logout;