<?php

/**
 * SpiritShop - Configuration File
 * 
 * Este arquivo contém as configurações principais do projeto
 */

// Configurações do Site
define('SITE_NAME', 'SpiritShop');
define('SITE_DESCRIPTION', 'Os melhores espíritos e bebidas premium para você');
define('SITE_URL', 'http://localhost/spiritshop');
define('SITE_EMAIL', 'contato@spiritshop.com');

// Configurações de Desenvolvimento
define('DEBUG_MODE', true); // Altere para false em produção
define('SHOW_ERRORS', true); // Altere para false em produção

// Configurações de Arquivos
define('DATA_DIR', __DIR__ . '/data/');
define('ASSETS_DIR', __DIR__ . '/assets/');
define('PRODUCTS_FILE', DATA_DIR . 'products.json');

// Configurações de Cache
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 3600); // 1 hora em segundos

// Configurações de Segurança
define('CSRF_TOKEN_NAME', 'spiritshop_csrf');
define('SESSION_NAME', 'spiritshop_session');

// Configurações de Paginação
define('PRODUCTS_PER_PAGE', 12);
define('RELATED_PRODUCTS_LIMIT', 3);

// Configurações de Imagens
define('DEFAULT_IMAGE_WIDTH', 400);
define('DEFAULT_IMAGE_HEIGHT', 400);
define('THUMBNAIL_WIDTH', 80);
define('THUMBNAIL_HEIGHT', 80);

// Configurações de CDN
define('BOOTSTRAP_CDN', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/');
define('FONT_AWESOME_CDN', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/');
define('SWIPER_CDN', 'https://cdn.jsdelivr.net/npm/swiper@10/');

// Configurações de Localização
define('DEFAULT_LOCALE', 'pt-BR');
define('CURRENCY', 'BRL');
define('CURRENCY_SYMBOL', 'R$');

// Funções de Utilidade

/**
 * Carrega os dados dos produtos do arquivo JSON
 * 
 * @return array Array com os dados dos produtos
 */
function loadProducts()
{
  if (!file_exists(PRODUCTS_FILE)) {
    error_log('Arquivo de produtos não encontrado: ' . PRODUCTS_FILE);
    return ['products' => []];
  }

  $jsonContent = file_get_contents(PRODUCTS_FILE);
  $data = json_decode($jsonContent, true);

  if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Erro ao decodificar JSON: ' . json_last_error_msg());
    return ['products' => []];
  }

  return $data;
}

/**
 * Formata preço para exibição
 * 
 * @param float $price Preço a ser formatado
 * @return string Preço formatado
 */
function formatPrice($price)
{
  return CURRENCY_SYMBOL . ' ' . number_format($price, 2, ',', '.');
}

/**
 * Gera URL amigável para produtos
 * 
 * @param string $title Título do produto
 * @param int $id ID do produto
 * @return string URL amigável
 */
function generateProductUrl($title, $id)
{
  $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
  return "product.php?id={$id}&slug=" . urlencode($slug);
}

/**
 * Valida se um ID de produto é válido
 * 
 * @param mixed $id ID a ser validado
 * @return bool True se válido, false caso contrário
 */
function isValidProductId($id)
{
  return is_numeric($id) && $id > 0 && $id <= 999999;
}

/**
 * Sanitiza entrada do usuário
 * 
 * @param string $input Entrada a ser sanitizada
 * @return string Entrada sanitizada
 */
function sanitizeInput($input)
{
  return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Verifica se está em modo de desenvolvimento
 * 
 * @return bool True se em desenvolvimento, false caso contrário
 */
function isDevelopment()
{
  return DEBUG_MODE;
}

/**
 * Log de erros personalizado
 * 
 * @param string $message Mensagem de erro
 * @param string $level Nível do erro (error, warning, info)
 */
function logError($message, $level = 'error')
{
  if (DEBUG_MODE) {
    error_log("[SpiritShop {$level}] " . $message);
  }
}

/**
 * Redireciona para uma URL
 * 
 * @param string $url URL para redirecionamento
 * @param int $statusCode Código de status HTTP
 */
function redirect($url, $statusCode = 302)
{
  header("Location: {$url}", true, $statusCode);
  exit;
}

/**
 * Obtém o produto por ID
 * 
 * @param int $id ID do produto
 * @return array|null Dados do produto ou null se não encontrado
 */
function getProductById($id)
{
  if (!isValidProductId($id)) {
    return null;
  }

  $data = loadProducts();
  $products = $data['products'] ?? [];

  foreach ($products as $product) {
    if ($product['id'] == $id) {
      return $product;
    }
  }

  return null;
}

/**
 * Obtém produtos relacionados
 * 
 * @param array $currentProduct Produto atual
 * @param int $limit Limite de produtos relacionados
 * @return array Array de produtos relacionados
 */
function getRelatedProducts($currentProduct, $limit = RELATED_PRODUCTS_LIMIT)
{
  $data = loadProducts();
  $products = $data['products'] ?? [];
  $related = [];

  foreach ($products as $product) {
    if (
      $product['id'] != $currentProduct['id'] &&
      $product['category'] == $currentProduct['category']
    ) {
      $related[] = $product;

      if (count($related) >= $limit) {
        break;
      }
    }
  }

  return $related;
}

/**
 * Filtra produtos por termo de busca
 * 
 * @param string $searchTerm Termo de busca
 * @return array Array de produtos filtrados
 */
function searchProducts($searchTerm)
{
  $data = loadProducts();
  $products = $data['products'] ?? [];
  $filtered = [];

  $searchTerm = strtolower(trim($searchTerm));

  if (empty($searchTerm)) {
    return $products;
  }

  foreach ($products as $product) {
    if (
      strpos(strtolower($product['title']), $searchTerm) !== false ||
      strpos(strtolower($product['shortDescription']), $searchTerm) !== false ||
      strpos(strtolower($product['category']), $searchTerm) !== false
    ) {
      $filtered[] = $product;
    }
  }

  return $filtered;
}

// Configurações de erro (apenas em desenvolvimento)
if (DEBUG_MODE && SHOW_ERRORS) {
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
} else {
  ini_set('display_errors', 0);
  ini_set('display_startup_errors', 0);
  error_reporting(0);
}

// Configurações de sessão
if (session_status() === PHP_SESSION_NONE) {
  session_name(SESSION_NAME);
  session_start();
}

// Configurações de timezone
date_default_timezone_set('America/Sao_Paulo');

// Configurações de locale
setlocale(LC_ALL, DEFAULT_LOCALE . '.UTF-8');

// Headers de segurança básicos
if (!headers_sent()) {
  header('X-Content-Type-Options: nosniff');
  header('X-Frame-Options: SAMEORIGIN');
  header('X-XSS-Protection: 1; mode=block');
}
