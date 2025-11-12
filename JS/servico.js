// tela_servico.js - Exibição de Detalhes do Serviço

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    verificarLogin();
    
    // Carregar dados do serviço selecionado
    carregarServicoSelecionado();
    
    // Carregar serviços relacionados
    carregarServicosRelacionados();
    
    // Setup event listeners
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

function carregarServicoSelecionado() {
    // Recuperar o serviço selecionado do localStorage
    const servicoJSON = localStorage.getItem('servicoSelecionado');
    
    if (!servicoJSON) {
        alert('Nenhum serviço selecionado!');
        window.location.href = '/WorkNet/home.html';
        return;
    }
    
    const servico = JSON.parse(servicoJSON);
    
    // Preencher os dados na página
    preencherDadosServico(servico);
}

function preencherDadosServico(servico) {
    // Atualizar título da página
    document.title = `${servico.titulo} - WorkNet`;
    
    // Imagem do serviço
    const imagemServico = document.querySelector('.imagem-servico img');
    if (imagemServico) {
        imagemServico.src = servico.imagem;
        imagemServico.alt = servico.titulo;
        imagemServico.onerror = function() {
            this.src = '/WorkNet/img/default-service.jpg';
        };
    }
    
    // Nome do prestador (h2)
    const nomePrestador = document.querySelector('.info-servico h2');
    if (nomePrestador) {
        nomePrestador.textContent = servico.autor;
    }
    
    // Título do serviço (h3)
    const tituloServico = document.querySelector('.info-servico h3');
    if (tituloServico) {
        tituloServico.textContent = servico.titulo;
    }
    
    // Descrição curta (subtítulo)
    const descricaoCurta = document.querySelector('.descricao-curta');
    if (descricaoCurta) {
        descricaoCurta.textContent = servico.subtitulo;
    }
    
    // Preço
    const preco = document.querySelector('.preco');
    if (preco) {
        preco.textContent = `R$ ${servico.preco.toFixed(2)}`;
    }
    
    // Descrição completa
    const textoDescricao = document.querySelector('.info-servico .texto');
    if (textoDescricao) {
        textoDescricao.textContent = servico.descricao;
    }
}

function carregarServicosRelacionados() {
    // Carregar todos os serviços do localStorage
    const servicosJSON = localStorage.getItem('servicos');
    let servicos = [];
    
    if (servicosJSON) {
        servicos = JSON.parse(servicosJSON);
    } else {
        // Serviços padrão se não houver no localStorage
        servicos = [
            {
                id: 1,
                titulo: 'João - Pedreiro',
                subtitulo: 'Pedreiro',
                descricao: 'Serviços de construção e reforma',
                preco: 150.00,
                autor: 'João Silva',
                imagem: '/WorkNet/img/listing1.jpg'
            },
            {
                id: 2,
                titulo: 'Paulo - Eletricista',
                subtitulo: 'Eletricista',
                descricao: 'Instalações elétricas',
                preco: 120.00,
                autor: 'Paulo Santos',
                imagem: '/WorkNet/img/listing2.jpg'
            },
            {
                id: 3,
                titulo: 'Lucas - Pintor',
                subtitulo: 'Pintor',
                descricao: 'Pintura residencial',
                preco: 100.00,
                autor: 'Lucas Costa',
                imagem: '/WorkNet/img/listing3.jpg'
            }
        ];
    }
    
    // Pegar o serviço atual
    const servicoAtualJSON = localStorage.getItem('servicoSelecionado');
    const servicoAtual = servicoAtualJSON ? JSON.parse(servicoAtualJSON) : null;
    
    // Filtrar para não mostrar o serviço atual
    let servicosRelacionados = servicos.filter(s => s.id !== servicoAtual?.id);
    
    // Limitar a 6 serviços relacionados
    servicosRelacionados = servicosRelacionados.slice(0, 6);
    
    // Renderizar os serviços relacionados
    renderizarServicosRelacionados(servicosRelacionados);
}

function renderizarServicosRelacionados(servicos) {
    const gradeServicos = document.querySelector('.grade-servicos');
    
    if (!gradeServicos || servicos.length === 0) return;
    
    gradeServicos.innerHTML = servicos.map(servico => `
        <article class="cartao-servico" data-servico-id="${servico.id}" style="cursor: pointer;">
            <div class="cartao-servico-imagem">
                <img src="${servico.imagem}" alt="${servico.titulo}" onerror="this.src='/WorkNet/img/default-service.jpg'">
            </div>
            <h3>${servico.titulo}</h3>
            <p>${servico.descricao}</p>
            <span class="preco">R$ ${servico.preco.toFixed(2)}</span>
        </article>
    `).join('');
    
    // Adicionar event listeners aos cards relacionados
    const cards = gradeServicos.querySelectorAll('.cartao-servico');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const servicoId = parseInt(this.dataset.servicoId);
            navegarParaServico(servicoId);
        });
    });
}

function navegarParaServico(servicoId) {
    // Carregar todos os serviços
    const servicosJSON = localStorage.getItem('servicos');
    if (!servicosJSON) return;
    
    const servicos = JSON.parse(servicosJSON);
    const servico = servicos.find(s => s.id === servicoId);
    
    if (servico) {
        // Atualizar o serviço selecionado
        localStorage.setItem('servicoSelecionado', JSON.stringify(servico));
        
        // Recarregar a página
        window.location.reload();
    }
}

function setupEventListeners() {
    // Botão de logout
    const logoutBtn = document.getElementById('botao-sair');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Botão contratar serviço
    const btnContratar = document.querySelector('.botao-contratar');
    if (btnContratar) {
        btnContratar.addEventListener('click', function() {
            // O serviço selecionado já está no localStorage
            window.location.href = '/WorkNet/tela_pagamnto.html';
        });
    }
    
    // Formulário de busca
    const searchForm = document.getElementById('formulario-pesquisa');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const termo = document.getElementById('campo-pesquisa')?.value;
            if (termo) {
                window.location.href = `/WorkNet/home.html?search=${encodeURIComponent(termo)}`;
            } else {
                window.location.href = '/WorkNet/home.html';
            }
        });
    }
}

function logout() {
    const confirmar = confirm('Deseja realmente sair?');
    if (confirmar) {
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('usuarioLogado');
        localStorage.removeItem('servicoSelecionado');
        alert('Logout realizado com sucesso!');
        window.location.href = '/WorkNet/index.html';
    }
}

// Tornar função global
window.logout = logout;