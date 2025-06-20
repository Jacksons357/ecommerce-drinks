<?php
// Verificar se o ID do produto foi fornecido
if (!isset($_GET['id'])) {
  header('Location: index.php');
  exit;
}

$productId = (int)$_GET['id'];

// Carregar dados dos produtos
$productsData = json_decode(file_get_contents('data/products.json'), true);
$products = $productsData['products'] ?? [];

// Encontrar o produto específico
$product = null;
foreach ($products as $p) {
  if ($p['id'] == $productId) {
    $product = $p;
    break;
  }
}

// Se o produto não for encontrado, redirecionar para a página principal
if (!$product) {
  header('Location: index.php');
  exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo $product['title']; ?> - SpiritShop</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Swiper CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
  <!-- Header -->
  <?php include 'components/header.php'; ?>

  <!-- Main Content -->
  <main class="container my-5">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="index.php">Produtos</a></li>
        <li class="breadcrumb-item active" aria-current="page"><?php echo $product['title']; ?></li>
      </ol>
    </nav>

    <div class="row">
      <!-- Product Images -->
      <div class="col-lg-6 mb-4">
        <div class="product-gallery">
          <div class="swiper product-swiper">
            <div class="swiper-wrapper">
              <?php foreach ($product['images'] as $image): ?>
                <div class="swiper-slide">
                  <img src="<?php echo $image; ?>" class="img-fluid rounded" alt="<?php echo $product['title']; ?>">
                </div>
              <?php endforeach; ?>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>

          <!-- Thumbnail Navigation -->
          <div class="swiper product-thumbs mt-3">
            <div class="swiper-wrapper">
              <?php foreach ($product['images'] as $index => $image): ?>
                <div class="swiper-slide">
                  <img src="<?php echo $image; ?>" class="img-fluid rounded thumbnail-img" alt="Thumbnail <?php echo $index + 1; ?>">
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="col-lg-6">
        <div class="product-details">
          <div class="mb-3">
            <span class="badge bg-primary"><?php echo $product['category']; ?></span>
          </div>

          <h1 class="h2 mb-3"><?php echo $product['title']; ?></h1>

          <div class="rating mb-3">
            <?php for ($i = 1; $i <= 5; $i++): ?>
              <i class="fas fa-star <?php echo $i <= $product['rating'] ? 'text-warning' : 'text-muted'; ?>"></i>
            <?php endfor; ?>
            <span class="ms-2 text-muted">(<?php echo $product['rating']; ?>/5)</span>
          </div>

          <div class="price-section mb-4">
            <span class="h3 text-primary">R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></span>
            <?php if (isset($product['originalPrice']) && $product['originalPrice'] > $product['price']): ?>
              <span class="text-muted text-decoration-line-through ms-2">R$ <?php echo number_format($product['originalPrice'], 2, ',', '.'); ?></span>
              <span class="badge bg-success ms-2"><?php echo round((($product['originalPrice'] - $product['price']) / $product['originalPrice']) * 100); ?>% OFF</span>
            <?php endif; ?>
          </div>

          <div class="product-description mb-4">
            <h5>Descrição</h5>
            <p class="text-muted"><?php echo $product['description']; ?></p>
          </div>

          <?php if (isset($product['specifications'])): ?>
            <div class="product-specifications mb-4">
              <h5>Especificações</h5>
              <ul class="list-unstyled">
                <?php foreach ($product['specifications'] as $spec): ?>
                  <li class="mb-2">
                    <i class="fas fa-check text-success me-2"></i>
                    <?php echo $spec; ?>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>
          <?php endif; ?>

          <!-- Product Reviews Section -->
          <div class="product-reviews mb-4">
            <h5>Avaliações do Produto</h5>

            <!-- Current Rating Display -->
            <div class="current-rating mb-3">
              <div class="d-flex align-items-center mb-2">
                <div class="rating-display me-3">
                  <span class="average-rating h4 text-primary"><?php echo number_format($product['rating'], 1); ?></span>
                  <div class="stars-display">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                      <i class="fas fa-star <?php echo $i <= $product['rating'] ? 'text-warning' : 'text-muted'; ?>"></i>
                    <?php endfor; ?>
                  </div>
                </div>
                <div class="rating-stats">
                  <span class="total-reviews text-muted">(<span class="review-count">0</span> avaliações)</span>
                </div>
              </div>
            </div>

            <!-- Review Form -->
            <div class="review-form mb-3">
              <h6>Avalie este produto</h6>
              <div class="rating-input mb-2">
                <div class="stars-container">
                  <?php for ($i = 1; $i <= 5; $i++): ?>
                    <i class="fas fa-star star-input" data-rating="<?php echo $i; ?>"></i>
                  <?php endfor; ?>
                </div>
                <span class="rating-text ms-2 text-muted">Clique nas estrelas para avaliar</span>
              </div>
              <div class="form-group">
                <textarea class="form-control" id="reviewComment" rows="3" placeholder="Deixe um comentário sobre sua experiência (opcional)"></textarea>
              </div>
              <button class="btn btn-primary btn-sm mt-2" id="submitReview" disabled>
                <i class="fas fa-paper-plane me-1"></i>Enviar Avaliação
              </button>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              <div id="reviewsContainer">
                <!-- Reviews will be loaded here dynamically -->
              </div>
            </div>
          </div>

          <div class="product-actions">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="input-group">
                  <button class="btn btn-outline-secondary" type="button" id="decreaseQuantity">
                    <i class="fas fa-minus"></i>
                  </button>
                  <input type="number" class="form-control text-center" id="quantity" value="1" min="1" max="99">
                  <button class="btn btn-outline-secondary" type="button" id="increaseQuantity">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-8">
                <button class="btn btn-primary btn-lg w-100" id="addToCart">
                  <i class="fas fa-shopping-cart me-2"></i>Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>

          <div class="product-info mt-4">
            <div class="row text-center">
              <div class="col-4">
                <i class="fas fa-shipping-fast text-primary mb-2"></i>
                <p class="small mb-0">Entrega Rápida</p>
              </div>
              <div class="col-4">
                <i class="fas fa-shield-alt text-primary mb-2"></i>
                <p class="small mb-0">Garantia</p>
              </div>
              <div class="col-4">
                <i class="fas fa-undo text-primary mb-2"></i>
                <p class="small mb-0">Devolução</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="related-products mt-5">
      <h3 class="mb-4">Produtos Relacionados</h3>
      <div class="row">
        <?php
        $relatedProducts = array_filter($products, function ($p) use ($product) {
          return $p['id'] != $product['id'] && $p['category'] == $product['category'];
        });
        $relatedProducts = array_slice($relatedProducts, 0, 3);
        ?>

        <?php foreach ($relatedProducts as $relatedProduct): ?>
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
              <img src="<?php echo $relatedProduct['image']; ?>" class="card-img-top" alt="<?php echo $relatedProduct['title']; ?>">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title"><?php echo $relatedProduct['title']; ?></h5>
                <p class="card-text text-muted"><?php echo $relatedProduct['shortDescription']; ?></p>
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="h6 text-primary">R$ <?php echo number_format($relatedProduct['price'], 2, ',', '.'); ?></span>
                    <div class="rating">
                      <?php for ($i = 1; $i <= 5; $i++): ?>
                        <i class="fas fa-star <?php echo $i <= $relatedProduct['rating'] ? 'text-warning' : 'text-muted'; ?> small"></i>
                      <?php endfor; ?>
                    </div>
                  </div>
                  <a href="product.php?id=<?php echo $relatedProduct['id']; ?>" class="btn btn-outline-primary w-100">
                    Ver Detalhes
                  </a>
                </div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-dark text-light py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h5><i class="fas fa-wine-bottle me-2"></i>SpiritShop</h5>
          <p class="text-muted">Os melhores espíritos e bebidas premium para você.</p>
        </div>
        <div class="col-md-6 text-md-end">
          <p class="text-muted mb-0">&copy; 2024 SpiritShop. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Swiper JS -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
  <!-- Custom JS -->
  <script src="assets/js/product.js"></script>
</body>

</html>