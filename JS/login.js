// login.js - Sistema de Login de Usuários com Auto-preenchimento

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    // Carregar credenciais salvas se existirem (sem redirecionar)
    carregarCredenciaisSalvas();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar valores dos campos
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const manterConectado = document.getElementById('manter-conectado').checked;
        
        // Validações básicas
        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Buscar usuários no localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Verificar se existem usuários cadastrados
        if (usuarios.length === 0) {
            alert('Nenhum usuário cadastrado. Por favor, faça seu cadastro primeiro.');
            return;
        }
        
        // Procurar usuário com email e senha correspondentes
        const usuarioEncontrado = usuarios.find(user => 
            user.email === email && user.senha === senha
        );
        
        if (usuarioEncontrado) {
            // Login bem-sucedido
            const dadosLogin = {
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                tipoUsuario: usuarioEncontrado.tipoUsuario,
                dataLogin: new Date().toISOString()
            };
            
            // Salvar dados do usuário logado
            if (manterConectado) {
                // Usar localStorage para manter conectado
                localStorage.setItem('usuarioLogado', JSON.stringify(dadosLogin));
                
                // Salvar credenciais para auto-preenchimento
                const credenciais = {
                    email: email,
                    senha: senha
                };
                localStorage.setItem('credenciaisSalvas', JSON.stringify(credenciais));
            } else {
                // Usar sessionStorage para não manter conectado
                sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosLogin));
                
                // Remover credenciais salvas
                localStorage.removeItem('credenciaisSalvas');
            }
            
            alert(`Login com sucesso! Bem-vindo(a), ${usuarioEncontrado.nome}!`);
            
            // Redirecionar para página principal
            window.location.href = '/WorkNet/home.html';
            
        } else {
            // Login falhou
            alert('Email ou senha incorretos. Por favor, tente novamente.');
        }
    });
});

// Função para carregar credenciais salvas (APENAS preencher campos)
function carregarCredenciaisSalvas() {
    const credenciaisSalvas = localStorage.getItem('credenciaisSalvas');
    
    if (credenciaisSalvas) {
        const credenciais = JSON.parse(credenciaisSalvas);
        
        // Preencher os campos
        document.getElementById('email').value = credenciais.email;
        document.getElementById('senha').value = credenciais.senha;
        document.getElementById('manter-conectado').checked = true;
        
        // Adicionar indicador visual de preenchimento automático
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        
        emailInput.style.backgroundColor = '#f0f9ff';
        senhaInput.style.backgroundColor = '#f0f9ff';
        
        // Adicionar mensagem informativa
        const form = document.querySelector('form');
        const infoMessage = document.createElement('div');
        infoMessage.style.cssText = `
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        `;
        
        infoMessage.innerHTML = `
            <p style="color: #1e40af; font-size: 0.9rem; margin: 0;">
                ℹ️ Dados preenchidos automaticamente. Clique em "Entrar" para continuar.
            </p>
        `;
        
        form.insertBefore(infoMessage, form.firstChild);
    }
}

// Função para fazer logout (para ser usada em outras páginas)
function logout() {
    // Perguntar se deseja remover credenciais salvas
    const removerCredenciais = confirm('Deseja remover também os dados de login automático?');
    
    if (removerCredenciais) {
        localStorage.removeItem('credenciaisSalvas');
    }
    
    localStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('usuarioLogado');
    alert('Logout realizado com sucesso!');
    window.location.href = '/WorkNet/login.html';
}

// Tornar função logout global para ser usada no HTML
window.logout = logout;