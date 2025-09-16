//import { apiFetch } from "./api.js";
import { consulta } from "./services/apiTecnologias.js";
import { consultaPOST, consultaProyectos } from "./services/apiProyectos.js";
import { ordenar } from "./utils.js";

//data
const selectOptions       = document.getElementById("tecnologias");
const selectOptionsNuevo  = document.getElementById("tecno-nuevo");
const selectOptionsEditar = document.getElementById("tecno-editar");
const modalNuevoProyecto  = document.getElementById("modal-nuevo-proyecto");
const modalEditarProyecto = document.getElementById("modal-editar-proyecto");
const formNuevo           = document.getElementById("form-nuevo");
const formEditar          = document.getElementById("form-editar");
const formBuscar          = document.getElementById("form-buscar");
const buttonNuevo         = document.getElementById("button-nuevo");
const buttonCerrarNuevo   = document.getElementById("cerrar-icon");
const buttonCancelNuevo   = document.getElementById("cancelar-nuevo");
const buttonCerrarEditar  = document.getElementById("cerrar-editar");
const buttonCancelEditar  = document.getElementById("cancelar-editar");
const buttonLimpiar       = document.getElementById("limpiar");
const inputBusqueda       = document.getElementById("busqueda");
let tecnologias           = [];
let proyectos             = [];

const choices = new Choices(selectOptionsNuevo, {
  removeItemButton: true,
  placeholderValue: "Selecc. tecnologías",
  searchEnabled: true,
  shouldSort: false
});

const choicesEdit = new Choices(selectOptionsEditar, {
  removeItemButton: true,
  placeholderValue: "Selecc. tecnologías",
  searchEnabled: true,
  shouldSort: false
});

const resetearValores = () => {
  modalNuevoProyecto.classList.add("d-none");
  formNuevo.reset();
};

const resetearValoresEditar = () => {
  modalEditarProyecto.classList.add("d-none");
  formEditar.reset();
};

if(buttonNuevo){
  buttonNuevo.addEventListener("click", () => {
    modalNuevoProyecto.classList.remove("d-none");
    agregarOptionNuevo();
  });
}

if(buttonCerrarNuevo){
  buttonCerrarNuevo.addEventListener("click", () =>{
    resetearValores();
  });
}

if(formNuevo){
  formNuevo.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    datos.tecnologias = choices.getValue(true);

    if(datos.tecnologias.length == 0){
      return Swal.fire({
        title: 'Error por tecnologías',
        text: "Se requiere que vincules al menos una tecnología al proyecto.",
        icon: 'info'
      });
    }
    await crearProyectos(datos);
  });
}

if(formBuscar){
  formBuscar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    await getProyectos(datos);
  });
}

if(formEditar){
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    
    datos.tecnologias = choicesEdit.getValue(true);
    if(datos.tecnologias.length == 0){
      return Swal.fire({
        title: 'Error por tecnologías',
        text: "Se requiere que vincules al menos una tecnología al proyecto.",
        icon: 'info'
      });
    }

    const id = document.getElementById("id_editar");
    if(id){
      datos.proyecto_id = id.value;
    }

    await editarProyecto(datos);
  });
}

if(buttonCancelNuevo){
  buttonCancelNuevo.addEventListener("click", () => {
    resetearValores();
  });
}

if(buttonCerrarEditar){
  buttonCerrarEditar.addEventListener("click", () =>{
    resetearValoresEditar();
  });
}
if(buttonCancelEditar){
  buttonCancelEditar.addEventListener("click", () => {
    resetearValoresEditar();
  });
}

if(buttonLimpiar){
  buttonLimpiar.addEventListener("click", () =>{
    formBuscar.reset();
  });
}

if(inputBusqueda){
  inputBusqueda.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = proyectos.filter(e => e.nombre.toLowerCase().includes(texto) || 
      String(e.proyecto_id).includes(texto) || e.fechaDesdeNuevo.includes(texto)
    );
    renderizarResultados(filtrados);
  });
}

//obtener datos principales
const obtenerTecnos = async ()=>{
  mostrarCarga(true);
  const res = await consulta({estado: "true"});
  mostrarCarga(false);

  tecnologias = res.tecnologias;
  ordenar(tecnologias,"nombre");
};
await obtenerTecnos();

//construir de forma dinámica las opciones de tecnologia 
const agregarOptionsTecnos = () => {
  const option = document.createElement("option");
  option.setAttribute("value", null);
  option.textContent = "";
  selectOptions.appendChild(option);
 
  tecnologias.forEach(e => {
    const option = document.createElement("option");
    option.setAttribute("value", e.tecnologia_id);
    option.textContent = e.nombre;
    selectOptions.appendChild(option);
  });
};
agregarOptionsTecnos();

//construcción de options para el modal de nuevo
const agregarOptionNuevo = () => {
  const origen = document.getElementById("tecnologias");
  const destino = document.getElementById("tecno-nuevo");

  if (destino.options.length === 0) {
    Array.from(origen.options).forEach(option => {
      destino.appendChild(option.cloneNode(true));
    });
  }

  tecnologias.forEach(e => {
    choices.setChoices(
      [{ value: e.tecnologia_id, label: e.nombre }],
      'value',
      'label',
      false
    );
  });
};

//funcion que hace el renderizado dinamico de los resultados de busqueda
const renderizarResultados = async (lista) => {
const tbody = document.getElementById("tbody-resultados");
  tbody.innerHTML = "";

  if(lista.length == 0){
    const trSinDatos  = document.createElement("tr");
    const tdSinDatos  = document.createElement("td");
    tdSinDatos.setAttribute("colspan", "7");
    
    const divSinDatos = document.createElement("div");
    divSinDatos.className = "w-60 mt-3 alert d-flex align-items-center justify-content-center text-wrap fs-5";
    divSinDatos.id = "sin-resultados";
    
    const icono = document.createElement("i");
    icono.className = "fa-solid fa-triangle-exclamation";
    divSinDatos.appendChild(icono);

    const texto = document.createTextNode(" No hay resultados para mostrar");
    divSinDatos.appendChild(texto);

    tdSinDatos.appendChild(divSinDatos);
    trSinDatos.appendChild(tdSinDatos);
    tbody.appendChild(trSinDatos);
    return;
  }
  lista.forEach(e => {
    const fila     = document.createElement("tr");
    
    const id       = document.createElement("th");
    id.setAttribute("scope", "row");
    id.setAttribute("data-label", "ID");
    id.textContent = e.proyecto_id;
    fila.appendChild(id);

    const nombre   = document.createElement("td");
    nombre.setAttribute("data-label", "Nombre");
    nombre.textContent = e.nombre;
    fila.appendChild(nombre);

    const fechaDesde = document.createElement("td");
    fechaDesde.setAttribute("data-label", "Fecha Desde");
    fechaDesde.textContent = e.fecha_desde;
    fila.appendChild(fechaDesde);

    const fechaHasta = document.createElement("td");
    fechaHasta.setAttribute("data-label", "Fecha Hasta");
    fechaHasta.textContent = e.fecha_hasta && e.fecha_hasta != '0000-00-00' ? e.fecha_hasta : '';
    fila.appendChild(fechaHasta);

    const estado   = document.createElement("td");
    estado.setAttribute("data-label", "Estado");
    estado.textContent = (e.inhabilitada == 0 ? 'Activo' : 'Inactiva');
    fila.appendChild(estado);

    const acciones = document.createElement("td");
    acciones.setAttribute("data-label", "Acciones");
    acciones.classList.add("row-acciones-tecno");

    const span = document.createElement("span");

    if(e.inhabilitada == 0){
      const iconoEditar = document.createElement("i");
      iconoEditar.id = `editar-${e.proyecto_id}`;
      iconoEditar.setAttribute("type", "button");
      iconoEditar.setAttribute("title", "Editar");
      iconoEditar.className = "fa-solid fa-pencil me-1 text-warning";
      iconoEditar.setAttribute("data-bs-toggle","tooltip");
      iconoEditar.setAttribute("data-bs-placement","bottom");
      iconoEditar.setAttribute("data-bs-title","Editar");
      iconoEditar.addEventListener("click", () => {
        abrirModalEdicion(e.proyecto_id);
      });
      span.appendChild(iconoEditar);
    }

    const iconoBloc   = document.createElement("i");
    iconoBloc.id = `blocked-${e.proyecto_id}`;
    iconoBloc.setAttribute("type", "button");
    iconoBloc.setAttribute("title", e.inhabilitada == 0 ? "Inhabilitar" : "Habilitar");
    iconoBloc.className =  e.inhabilitada == 0 ? "fa-solid fa-ban text-danger" : "fa-solid fa-check text-success";
    iconoBloc.setAttribute("data-bs-toggle","tooltip");
    iconoBloc.setAttribute("data-bs-placement","bottom");
    iconoBloc.setAttribute("data-bs-title",e.inhabilitada == 0 ? "Inhabilitar" : "Habilitar");
    iconoBloc.addEventListener("click", () => {
      bloqueoDesbloqueo(e.proyecto_id, (e.inhabilitada == 0));
    });
    span.appendChild(iconoBloc);

    acciones.appendChild(span);
    fila.appendChild(acciones);

    tbody.appendChild(fila);
  }); 
}

//funcion para buscar los proyectos en la base
const getProyectos = async(filtros) => {
  if(filtros.proyecto_id) filtros.proyecto_id = parseInt(filtros.proyecto_id);
  filtros.tecnologia = filtros.tecnologia !== 'null' ? parseInt(filtros.tecnologia) : null;

  mostrarCarga(true);
  const res = await consultaProyectos(filtros);
  mostrarCarga(false);

  proyectos = res.proyectos;
  renderizarResultados(proyectos);
};

//crear nuevo proyecto
const crearProyectos = async (datos) => {
  const result = await Swal.fire({
    title: 'Confirmar acción',
    html: `¿Estás seguro de crear el nuevo proyecto <strong>${datos.nombre}</strong>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#0D6EFD",
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  datos.accion      = 'crear';
  datos.nombre      = datos.nombre.trim();
  datos.descripcion = datos.descripcion.trim();
  datos.url         = datos.url.trim();

  mostrarCarga(true);
  const res = await consultaPOST(datos);
  mostrarCarga(false);

  if(res.resultado == 0){
    return Swal.fire({
      title: 'Error al crear el nuevo proyecto',
      text: res.msj,
      icon: 'error'
    });
  }
  Swal.fire({
    title: 'Nueva Proyecto',
    text: 'Se creó correctamente el proyecto.',
    icon: 'success'
  });

  resetearValores();
  
  await getProyectos({ //mandar a buscarlo por filtros
    estado: "",
    fecha_desde: datos.fechaDesdeNuevo,
    fecha_hasta: datos.fechaHastaNuevo,
    nombre: datos.nombre,
    proyecto_id: res.id,
  });
};

//funcion que prepara el modal editar con los datos existentes del proyecto 
const abrirModalEdicion = (id) => {
  modalEditarProyecto.classList.remove("d-none");
  const project = proyectos.find(e => e.proyecto_id == id);

  for (const [clave, valor] of Object.entries(project)) {
    const campo = formEditar.elements[clave];
    if (campo && clave !== 'tecnologias') {
      campo.value = (clave === "inhabilitada" ? (valor == 0) : valor);
    }
  }

  choicesEdit.clearChoices();
  choicesEdit.setChoices(
    tecnologias.map(t => ({
      value: String(t.tecnologia_id),
      label: t.nombre,
      selected: project.tecnologias.some(p => p.tecnologia_id === t.tecnologia_id)
    })),
    'value',
    'label',
    true
  );
};

const bloqueoDesbloqueo = async (id, bloquear) => {
  const project = proyectos.find(e => e.proyecto_id == id);
  if (!project) return;

  const result = await Swal.fire({
    title: 'Confirmar acción',
    html: `¿Estás seguro de ${bloquear ? 'inhabilitar' : 'habilitar'} <strong>${project.nombre}</strong>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#0D6EFD",
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  let datos = { id, accion: bloquear? 'bloquear' : 'desbloquear' };

  mostrarCarga(true);
  const res = await consultaPOST(datos);
  mostrarCarga(false);

  if (res.resultado === 0) {
    return await Swal.fire({
      title: 'Error ' + (bloquear ? 'de bloqueo' : 'al desbloquear'),
      text: res.msj,
      icon: 'error',
      confirmButtonText: 'Ok',
      confirmButtonColor: "#0D6EFD"
    });
  }

  await Swal.fire({
    title: (bloquear ? 'Bloqueo' : 'Desbloqueo') +' exitoso',
    html: `Se ${bloquear?'inhabilitó' : 'habilitó'} correctamente el proyecto <strong>${project.nombre}</strong>`,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#198754"
  });
  
  await getProyectos({
    proyecto_id: project.proyecto_id
  });
}; 

const editarProyecto = async (datos) => {
  console.log("llego al editar: ", datos)
  if (Object.keys(datos).length == 0 || !datos){
      return Swal.fire({
        title: 'Objeto vacío',
        text: `Los datos del proyecto que deseas modificar no llegaron.`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: "#0D6EFD"
      });
    }
  
    const result = await Swal.fire({
      title: 'Confirmar acción',
      html: `¿Estás seguro de aplicar cambios sobre el proyecto <strong>${datos.nombre}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: "#0D6EFD",
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
  
    datos.accion = "editar";
  
    mostrarCarga(true);
    const res = await consultaPOST(datos);
    mostrarCarga(false);
  
    if (res.resultado === 0) {
      return await Swal.fire({
        title: 'Error al editar',
        text: res.msj,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: "#0D6EFD"
      });
    }
  
    await Swal.fire({
      title: 'Modificación exitosa',
      html: `Se modificaron correctamente los datos del proyecto <strong>${datos.nombre}</strong>`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: "#198754"
    });
  
    resetearValoresEditar();
    await getProyectos({
      id: datos.proyecto_id,
      nombre: datos.nombre,
      inhabilitada: datos.inhabilitada
    });
};