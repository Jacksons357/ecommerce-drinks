# SpiritShop - Teste Técnico

Um projeto de e-commerce desenvolvido com PHP, Bootstrap, JavaScript e SCSS.

## 🍷 Sobre o Projeto

O SpiritShop é uma aplicação web responsiva que simula uma loja de bebidas espirituosas premium. O projeto inclui:

- **Página de Listagem de Produtos**: Grid responsivo com cards de produtos
- **Página de Detalhes do Produto**: Informações completas com slider de imagens
- **Sistema de Busca**: Filtro em tempo real por título dos produtos
- **Sistema de Avaliação**: Interface interativa para avaliação de produtos
- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Interatividade**: Animações, hover effects e feedback visual

## 🚀 Tecnologias Utilizadas

- **PHP**: Backend básico para carregamento de dados
- **HTML5**: Estrutura semântica
- **Bootstrap 5.3.0**: Framework CSS para design responsivo
- **JavaScript (ES6+)**: Interatividade e funcionalidades dinâmicas
- **SCSS**: Pré-processador CSS para estilos organizados
- **SwiperJS**: Biblioteca para slider de imagens
- **Font Awesome**: Ícones
- **Unsplash**: Imagens de produtos
- **localStorage**: Armazenamento local de dados

## 📁 Estrutura do Projeto

```
spiritshop/
├── index.php                 # Página principal (listagem de produtos)
├── product.php              # Página de detalhes do produto
├── config.php              # Página de configuração do servidor
├── data/
│   └── products.json        # Dados dos produtos em JSON
├── assets/
│   ├── css/
│   │   └── style.css        # Estilos compilados
│   ├── scss/
│   │   └── style.scss       # Estilos em SCSS
│   └── js/
│       ├── main.js          # JavaScript da página principal
│       └── product.js       # JavaScript da página de produto (inclui sistema de avaliação)
├── components               # Todos componentes da aplicação
└── README.md                # Arquivo de instrução da aplicação
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Servidor web com suporte a PHP (Apache, Nginx, etc.)
- PHP 7.4 ou superior
- Navegador web moderno com suporte a localStorage

### Passos para Instalação

1. **Clone ou baixe o projeto**

   ```bash
   git clone https://github.com/Jacksons357/spiritshop.git
   cd spiritshop
   ```

2. **Configure o servidor web**

   - Coloque os arquivos em um diretório acessível pelo servidor web
   - Certifique-se de que o PHP está habilitado

3. **Acesse a aplicação**

   - Abra o navegador e acesse: `http://localhost/spiritshop/`
   - Ou use um servidor local como XAMPP, WAMP, ou similar

   - **Alternativa**: Use o servidor PHP embutido:
     ```bash
     php -S localhost:8000
     ```
     E acesse: `http://localhost:8000`

### Desenvolvimento

Para trabalhar com os estilos SCSS:

1. **Instale o Sass** (opcional)

   ```bash
   # Ubuntu/Debian
   sudo apt install ruby-sass

   # macOS
   brew install sass/sass/sass

   # Windows
   npm install -g sass
   ```

2. **Compile o SCSS**

   ```bash
   sass assets/scss/style.scss assets/css/style.css
   ```

3. **Compilação automática** (desenvolvimento)
   ```bash
   sass --watch assets/scss/style.scss assets/css/style.css
   ```

## 🎯 Funcionalidades

### Página Principal (`index.php`)

- **Grid de Produtos**: Layout responsivo com cards de produtos
- **Sistema de Busca**: Filtro em tempo real por título
- **Animações**: Efeitos de hover e transições suaves
- **Histórico de Busca**: Salva pesquisas recentes no localStorage
- **Contador de Produtos**: Mostra quantidade de produtos encontrados

### Página de Produto (`product.php`)

- **Slider de Imagens**: Galeria com SwiperJS
- **Navegação por Thumbnails**: Miniaturas clicáveis
- **Controles de Quantidade**: Botões +/- para ajustar quantidade
- **Cálculo de Preço Total**: Atualização dinâmica do valor
- **Sistema de Avaliação**: Interface completa de avaliação de produtos
- **Botões de Compartilhamento**: WhatsApp, Facebook, Twitter
- **Produtos Relacionados**: Sugestões baseadas na categoria

### ⭐ Sistema de Avaliação de Produtos

O SpiritShop inclui um sistema completo de avaliação implementado em JavaScript puro:

#### Funcionalidades Principais

- **Estrelas Interativas**: Sistema de 1 a 5 estrelas com efeitos visuais
- **Formulário de Avaliação**: Campo opcional para comentários
- **Armazenamento Local**: Todas as avaliações são salvas no localStorage
- **Cálculo Automático**: Média das avaliações atualizada em tempo real
- **Lista de Avaliações**: Exibição organizada com avatares e datas
- **Responsividade**: Interface adaptada para todos os dispositivos

#### Características Técnicas

- **JavaScript Puro**: Sem dependências externas para máxima compatibilidade
- **Persistência**: Dados mantidos entre sessões do navegador
- **Validação**: Rating obrigatório, comentário opcional
- **Segurança**: Escape de HTML para prevenir XSS
- **Performance**: Renderização eficiente e otimizada

#### Como Usar

1. Acesse qualquer página de produto
2. Role até a seção "Avaliações do Produto"
3. Clique nas estrelas para selecionar sua avaliação (1-5)
4. Opcionalmente, adicione um comentário
5. Clique em "Enviar Avaliação"
6. Veja a média atualizada e sua avaliação na lista

### Recursos Adicionais

- **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **Acessibilidade**: Navegação por teclado e leitores de tela
- **Performance**: Lazy loading de imagens e otimizações
- **UX/UI**: Feedback visual e estados de loading
- **LocalStorage**: Persistência de dados do carrinho, histórico e avaliações

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:

- **Desktop**: Layout completo com 3 colunas
- **Tablet**: Layout adaptado com 2 colunas
- **Mobile**: Layout otimizado com 1 coluna

### Sistema de Avaliação Responsivo

- **Desktop**: Estrelas horizontais, layout completo
- **Tablet**: Ajustes no espaçamento e organização
- **Mobile**: Layout vertical, estrelas em container próprio

## 🎨 Personalização

### Cores e Temas

As cores principais estão definidas como variáveis CSS no arquivo `assets/css/style.css`:

```css
:root {
  --primary-color: #6f42c1;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --dark-color: #343a40;
  --light-color: #f8f9fa;
}
```

### Adicionando Produtos

Para adicionar novos produtos, edite o arquivo `data/products.json`:

```json
{
  "id": 9,
  "title": "Nome do Produto",
  "shortDescription": "Descrição breve",
  "description": "Descrição completa",
  "price": 99.9,
  "rating": 4,
  "category": "Categoria",
  "image": "url-da-imagem-principal",
  "images": ["url1", "url2", "url3"],
  "specifications": ["Especificação 1", "Especificação 2"]
}
```

## 🔧 Configurações Avançadas

### CDNs Utilizados

- **Bootstrap**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/`
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/`
- **SwiperJS**: `https://cdn.jsdelivr.net/npm/swiper@10/`

### Otimizações

- **Imagens**: Otimizadas para web com diferentes tamanhos
- **CSS**: Minificado e organizado
- **JavaScript**: Modular e eficiente
- **Cache**: Headers apropriados para cache de recursos
- **localStorage**: Armazenamento otimizado para avaliações

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Imagens não carregam**

   - Verifique se as URLs das imagens estão acessíveis
   - O projeto usa imagens do Unsplash como placeholder

2. **Slider não funciona**

   - Verifique se o SwiperJS está carregado corretamente
   - Confirme se há múltiplas imagens no produto

3. **Busca não funciona**

   - Verifique se o JavaScript está habilitado
   - Confirme se o arquivo `main.js` está sendo carregado

4. **Estilos não aplicados**

   - Verifique se o arquivo `style.css` está sendo carregado
   - Confirme se o Bootstrap está funcionando

5. **Sistema de Avaliação não funciona**
   - Verifique se o navegador suporta localStorage
   - Confirme se o JavaScript está habilitado
   - Verifique se o arquivo `product.js` está sendo carregado

### Limpeza de Dados

Para limpar as avaliações armazenadas:

```javascript
// No console do navegador
localStorage.clear(); // Remove todos os dados
// Ou para um produto específico:
localStorage.removeItem("spiritshop_reviews_1");
```

## 📊 Estrutura de Dados

### Avaliações no localStorage

```json
{
  "spiritshop_reviews_1": [
    {
      "id": 1703123456789,
      "rating": 4,
      "comment": "Produto muito bom!",
      "date": "2024-01-15T10:30:45.123Z",
      "reviewer": "João Silva"
    }
  ]
}
```

## 🚀 Próximas Melhorias

### Funcionalidades Planejadas

- Sistema de moderação de avaliações
- Filtros por rating e data
- Upload de fotos nas avaliações
- Integração com backend real
- Sistema de notificações

### Otimizações Futuras

- Lazy loading para muitas avaliações
- Compressão de dados no localStorage
- Cache inteligente
- PWA (Progressive Web App)

---

**Desenvolvido com ❤️ para demonstrar habilidades em desenvolvimento web moderno.**
