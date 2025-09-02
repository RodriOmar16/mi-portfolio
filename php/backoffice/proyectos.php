<section class="vista-proyectos">
  <h2>Gestión de Proyectos</h2>
  <div class="acciones">
    <button id="btnNuevoProyecto">+ Nuevo Proyecto</button>
    <input type="text" id="filtroProyecto" placeholder="Buscar...">
  </div>
  <table id="tablaProyectos">
    <thead>
      <tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>
    </thead>
    <tbody></tbody>
  </table>
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
