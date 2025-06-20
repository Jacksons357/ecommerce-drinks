<?php
// Carregar dados dos produtos do arquivo JSON
$productsData = json_decode(file_get_contents('data/products.json'), true);
$products = $productsData['products'] ?? [];

// Definir título da página
$pageTitle = 'SpiritShop - Produtos';
?>

<!DOCTYPE html>
<html lang="pt-BR">

<?php include 'components/head.php'; ?>

<body>
  <!-- Header -->
  <?php include 'components/header.php'; ?>

  <!-- Main Content -->
  <main class="container my-5">
    <!-- Hero Section -->
    <?php include 'components/hero.php'; ?>

    <!-- Search Filter -->
    <?php include 'components/search-filter.php'; ?>

    <!-- Products Grid -->
    <?php include 'components/products-grid.php'; ?>
  </main>

  <!-- Footer -->
  <?php include 'components/footer.php'; ?>

  <!-- Scripts -->
  <?php include 'components/scripts.php'; ?>
</body>

</html>