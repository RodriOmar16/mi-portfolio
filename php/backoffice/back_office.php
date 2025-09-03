<?php
  session_start();
  if (!isset($_SESSION['usuario'])) {
    header("Location: ../login/index.php");
    exit();
  }
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Back Office</title>
    <link rel="icon" href="../../imagenes/innovartic fav icon.svg" type="image/png">
    <link rel="stylesheet" href="../../styles/backoffice.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <?php
      $vista = $_GET['view'] ?? 'inicio';
      if ($vista === 'proyectos') {
        echo '<link rel="stylesheet" href="../../styles/proyectosBackOffice.css">';
      } elseif ($vista === 'tecnologias') {
        echo '<link rel="stylesheet" href="../../styles/tecnologiasBackOffice.css">';
      } else {
        echo '<link rel="stylesheet" href="../../styles/inicioBackOffice.css">';
      }
    ?>
  </head>
  <body>
    <header id="seccion-header">
      <div class="barra-nav fixed-top">
        <h5 class="text-wrap text-break">Bienvenido, <?= $_SESSION['usuario'] ?></h5>
        <nav class="navbar navbar-expand-lg">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse"  id="navbarText">
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="?view=inicio">Inicio</a></li>
                <li class="nav-item"><a class="nav-link" href="?view=proyectos">Proyectos</a></li>
                <li class="nav-item"><a class="nav-link" href="?view=tecnologias">Tecnologías</a></li>
                <li class="nav-item">
                  <button type="button" class="btn btn-outline-primary"
                    onclick="location.href='../../index.html'"
                  >Salir <i class="fa-solid fa-right-from-bracket"></i></button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <main class="vistas-main">
      <?php
        $vista = $_GET['view'] ?? 'inicio';
        if ($vista === 'proyectos') {
          include '../proyectos/proyectos.php';
        } elseif ($vista === 'tecnologias') {
          include '../tecnologias/tecnologias.php';
        } else {
          include 'inicio.php';
        }
      ?>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  </body>
</html>