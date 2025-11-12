// cadastro.js - Sistema de Registro de Usuários

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar valores dos campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const cpf = document.getElementById('cpf').value.trim();
        const tipoUsuario = document.getElementById('tipo-usuario').value;
        
        // Validações
        if (!validarNome(nome)) {
            alert('Por favor, insira um nome completo válido (mínimo 3 caracteres).');
            return;
        }
        
        if (!validarEmail(email)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        
        if (!validarSenha(senha)) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        if (!validarCPF(cpf)) {
            alert('Por favor, insira um CPF válido no formato 000.000.000-00.');
            return;
        }
        
        if (!tipoUsuario) {
            alert('Por favor, selecione o tipo de usuário.');
            return;
        }
        
        // Verificar se o email já está cadastrado
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const emailExiste = usuarios.find(user => user.email === email);
        
        if (emailExiste) {
            alert('Este email já está cadastrado. Por favor, faça login ou use outro email.');
            return;
        }
        
        // Criar objeto do usuário
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            cpf: cpf,
            tipoUsuario: tipoUsuario,
            dataCadastro: new Date().toISOString()
        };
        
        // Adicionar ao array de usuários
        usuarios.push(novoUsuario);
        
        // Salvar no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Mensagem de sucesso
        alert('Usuário cadastrado com sucesso! Você será redirecionado para a página de login.');
        
        // Limpar formulário
        form.reset();
        
        // Redirecionar para login (opcional)
        // window.location.href = 'login.html';
    });
});

// Função para validar nome completo
function validarNome(nome) {
    return nome.length >= 3;
}

// Função para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para validar senha
function validarSenha(senha) {
    return senha.length >= 6;
}

// Função para validar CPF
function validarCPF(cpf) {
    // Remove pontos, traços e espaços
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Verifica se tem exatamente 11 dígitos
    if (cpfLimpo.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cpfLimpo)) {
        return false;
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
}

// Função para formatar CPF enquanto digita
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            // Remove tudo que não é número
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            value = value.substring(0, 11);
            
            // Formata o CPF
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
        
        // Previne colar texto com mais de 11 dígitos
        cpfInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.substring(0, 11);
                
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                }
                
                e.target.value = value;
            }, 10);
        });
    }
});