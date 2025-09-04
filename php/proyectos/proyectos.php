<section class="vista-proyectos">
  <div class="card contenedor-seccion-filtros">
    <div class="card-body">
      <h4 class="card-title"><i class="fa-solid fa-filter icono-filtros"></i> Filtros</h4>
      <form class="contenedor-filtros">
        <div class="row">
          <div class="col-lg-2 col-md-4 col-sm-6">
            <label for="id" class="form-label">Id</label>
            <input type="number" class="form-control" id="id">
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <label for="nombre" class="form-label">Nombre </label>
            <input type="number" class="form-control" id="nombre">
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <label for="fechaDesde" class="form-label">Fecha desde</label>
            <input type="date" class="form-control" id="fechaDesde">
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <label for="fechaHasta" class="form-label">Fecha hasta</label>
            <input type="date" class="form-control" id="fechaHasta">
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <label for="estados" class="form-label">Estado</label>
            <select name="estados" id="estados" class="form-select">
              <!--options dinamicos-->
            </select>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6 contenedor-button-buscar">
            <button class="btn btn-primary"> <i class="fa-solid fa-magnifying-glass"></i> Buscar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="contenedor-resultados card">
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Duración (meses)</th>
            <th scope="col">Fecha Inicio</th>
            <th scope="col">Fecha Hasta</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>John</td>
            <td>Doe</td>
            <td>@social</td>
            <td>@social</td>
            <td>@social</td>
            <td>@social</td>
            <td>@social</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<script>
fetch('api_proyectos.php')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#tablaProyectos tbody');
    data.forEach(proyecto => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${proyecto.nombre}</td>
        <td>${proyecto.descripcion}</td>
        <td><button>Editar</button> <button>Eliminar</button></td>
      `;
      tbody.appendChild(fila);
    });
  });
</script>
