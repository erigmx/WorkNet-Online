document.addEventListener('DOMContentLoaded', function() {
    // Verificar login
    verificarLogin();
    
    // Carregar dados do serviço
    carregarDadosServico();
    
    // Elementos do DOM
    const cardSection = document.getElementById('cardSection');
    const savedCardsSection = document.getElementById('savedCardsSection');
    const newCardForm = document.getElementById('newCardForm');
    const addCardBtn = document.getElementById('addCardBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const payBtn = document.getElementById('payBtn');

    // Abrir o accordion por padrão
    if (cardSection) {
        cardSection.open = true;
    }

    // Botão adicionar novo cartão
    if (addCardBtn) {
        addCardBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Esconder a seção de cartões salvos
            if (savedCardsSection) {
                savedCardsSection.style.display = 'none';
            }
            
            // Mostrar o formulário
            if (newCardForm) {
                newCardForm.style.display = 'block';
                newCardForm.classList.add('show');
                
                // Scroll suave até o formulário
                setTimeout(() => {
                    newCardForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }

    // Botão cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (newCardForm) {
                newCardForm.classList.remove('show');
                newCardForm.style.display = 'none';
                newCardForm.reset();
            }
            
            if (savedCardsSection) {
                savedCardsSection.style.display = 'block';
            }
        });
    }

    // Formatação do número do cartão
    const cardNumberInput = document.querySelector('input[name="cardNumber"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Formatação da data de validade
    const expiryInput = document.querySelector('input[name="expiry"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Formatação do CPF
    const cpfInput = document.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Apenas números no CVV
    const cvvInput = document.querySelector('input[name="cvv"]');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Salvar novo cartão
    if (newCardForm) {
        newCardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const cardName = formData.get('cardName');
            const cardNumber = formData.get('cardNumber');
            
            // Pegar os últimos 4 dígitos
            const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
            
            // Detectar bandeira (simplificado)
            const firstDigit = cardNumber.charAt(0);
            let brand = 'VISA';
            let brandClass = 'visa';
            
            if (firstDigit === '5') {
                brand = '●●';
                brandClass = 'mastercard';
            }
            
            // Criar novo item de cartão
            const cardsFieldset = document.querySelector('.cards-fieldset');
            if (cardsFieldset) {
                const newCardItem = document.createElement('label');
                newCardItem.className = 'card-item';
                newCardItem.innerHTML = `
                    <input type="radio" name="card" value="new-card">
                    <span class="card-info">
                        <strong class="card-brand ${brandClass}">${brand}</strong>
                        <span class="card-name">${cardName}</span>
                        <span class="card-number">•••• •••• •••• ${lastFour}</span>
                    </span>
                    <span class="radio-custom"></span>
                `;
                
                cardsFieldset.appendChild(newCardItem);
                
                // Selecionar o novo cartão
                const newRadio = newCardItem.querySelector('input[type="radio"]');
                newRadio.checked = true;
                
                // Feedback visual
                newCardItem.style.animation = 'slideDown 0.3s ease';
                
                // Mostrar mensagem de sucesso
                showNotification('Cartão adicionado com sucesso! ✅', 'success');
            }
            
            // Voltar para a lista de cartões
            newCardForm.classList.remove('show');
            newCardForm.style.display = 'none';
            if (savedCardsSection) {
                savedCardsSection.style.display = 'block';
            }
            newCardForm.reset();
        });
    }

    // Botão de pagamento
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            const selectedCard = document.querySelector('input[name="card"]:checked');
            
            if (selectedCard) {
                // Animação de loading no botão
                const originalText = payBtn.textContent;
                payBtn.textContent = 'Processando...';
                payBtn.disabled = true;
                payBtn.style.opacity = '0.7';
                
                // Simular processamento de pagamento
                setTimeout(() => {
                    showNotification('Pagamento realizado com sucesso! ✅', 'success');
                    payBtn.textContent = originalText;
                    payBtn.disabled = false;
                    payBtn.style.opacity = '1';
                    
                    // Redirecionar para home após 2 segundos
                    setTimeout(() => {
                        window.location.href = '/WorkNet/home.html';
                    }, 2000);
                }, 2000);
            } else {
                showNotification('Por favor, selecione um método de pagamento.', 'error');
            }
        });
    }
    
    // Botão de logout
    const logoutBtn = document.getElementById('botao-sair');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/WorkNet/login.html';
        return;
    }
}

function carregarDadosServico() {
    // Recuperar o serviço selecionado
    const servicoJSON = localStorage.getItem('servicoSelecionado');
    
    if (!servicoJSON) {
        alert('Nenhum serviço selecionado!');
        window.location.href = '/WorkNet/home.html';
        return;
    }
    
    const servico = JSON.parse(servicoJSON);
    
    // Atualizar título da página
    document.title = `Pagamento - ${servico.titulo} - WorkNet`;
    
    // Atualizar card do serviço
    const serviceImage = document.querySelector('.service-image');
    if (serviceImage) {
        serviceImage.src = servico.imagem;
        serviceImage.alt = servico.autor;
        serviceImage.onerror = function() {
            this.src = '/WorkNet/img/default-service.jpg';
        };
    }
    
    const serviceTitle = document.querySelector('.service-title');
    if (serviceTitle) {
        serviceTitle.textContent = servico.autor;
    }
    
    const serviceDescription = document.querySelector('.service-description');
    if (serviceDescription) {
        serviceDescription.textContent = servico.titulo;
    }
    
    const servicePrice = document.querySelector('.service-price');
    if (servicePrice) {
        servicePrice.textContent = `R$ ${servico.preco.toFixed(2)}`;
    }
    
    // Atualizar resumo do pedido
    const summaryList = document.querySelector('.summary-list');
    if (summaryList) {
        const taxaServico = 2.00;
        const total = servico.preco + taxaServico;
        
        summaryList.innerHTML = `
            <dt>${servico.titulo}</dt>
            <dd>R$ ${servico.preco.toFixed(2)}</dd>
            
            <dt>Taxa de Serviço</dt>
            <dd>R$ ${taxaServico.toFixed(2)}</dd>
        `;
        
        // Atualizar total
        const totalValue = document.querySelector('.total-value');
        if (totalValue) {
            totalValue.textContent = `R$ ${total.toFixed(2)}`;
        }
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

// Função para mostrar notificações
function showNotification(message, type) {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('aside');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);