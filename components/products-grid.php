<?php

/**
 * Products Grid Component
 * 
 * Componente reutilizável para o grid de produtos
 * 
 * @param array $products Array de produtos a serem exibidos
 */
?>

<!-- Products Grid -->
<div class="row" id="productsGrid">
  <?php foreach ($products as $product): ?>
    <div class="col-lg-4 col-md-6 mb-4 product-card" data-title="<?php echo strtolower($product['title']); ?>">
      <div class="card h-100 shadow-sm product-card-inner">
        <div class="card-img-top-container">
          <img src="<?php echo $product['image']; ?>" class="card-img-top" alt="<?php echo $product['title']; ?>">
          <div class="card-img-overlay d-flex align-items-center justify-content-center">
            <div class="overlay-content">
              <span class="badge bg-primary mb-2"><?php echo $product['category']; ?></span>
            </div>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title"><?php echo $product['title']; ?></h5>
          <p class="card-text text-muted"><?php echo $product['shortDescription']; ?></p>
          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="h5 text-primary mb-0">R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></span>
              <div class="rating">
                <?php for ($i = 1; $i <= 5; $i++): ?>
                  <i class="fas fa-star <?php echo $i <= $product['rating'] ? 'text-warning' : 'text-muted'; ?>"></i>
                <?php endfor; ?>
              </div>
            </div>
            <a href="product.php?id=<?php echo $product['id']; ?>" class="btn btn-primary w-100">
              <i class="fas fa-eye me-2"></i>Ver Mais
            </a>
          </div>
        </div>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<!-- No Results Message -->
<div class="row d-none" id="noResults">
  <div class="col-12 text-center">
    <div class="alert alert-info">
      <i class="fas fa-search me-2"></i>
      Nenhum produto encontrado com o termo pesquisado.
    </div>
  </div>
</div>

<?php
/**
 * Fim do Products Grid Component
 */
?>