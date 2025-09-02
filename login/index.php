<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="..//styles/login.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="icon" href="../imagenes/innovartic fav icon.svg" type="image/png">
    <title>Iniciar sesión</title>
  </head>
  <body>
    <div class="contenedor-login">
      <form action="validar_login.php" method="post" class="contenedor-form">
        <div class="contenedor-encabezado-form">
          <figure>
            <img src="../imagenes/innovartic fav icon.svg" width="50" alt="">
          </figure>
          <h4 class="text-center mb-4">Iniciar Sesión</h4>
        </div>
        <div class="mb-3">
          <label for="emailUser" class="form-label">Email</label>
          <input name="emailUser" type="email" class="form-control" id="emailUser" aria-describedby="emailHelp" required>
        </div>  
        <div class="mb-3">
          <label for="pass" class="form-label">Contraseña</label>
          <input name="pass" type="password" class="form-control" id="pass"  required>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="recordarmeCheck">
          <label class="form-check-label" for="recordarmeCheck">Recordarme</label>
        </div>
        <button type="submit" class="btn btn-outline-primary w-100">Iniciar sesión</button>

        <?php if (isset($_GET['error'])): ?>
          <div class="mt-3 alert alert-danger"><i class="fa-solid fa-circle-xmark"></i> Credenciales inválidas</div>
        <?php endif; ?>
      </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  </body>
</html>