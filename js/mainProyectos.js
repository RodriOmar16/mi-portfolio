//import { apiFetch } from "./api.js";
import { consulta } from "./services/apiTecnologias.js";
import { consultaPOST, consultaProyectos } from "./services/apiProyectos.js";
import { ordenar } from "./utils.js";

//data
const selectOptions       = document.getElementById("tecnologias");
const selectOptionsNuevo  = document.getElementById("tecno-nuevo");
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
let tecnologias           = [];

const choices = new Choices(selectOptionsNuevo, {
    removeItemButton: true,
    placeholderValue: "Seleccioná tecnologías",
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

//obtener datos principales
const obtenerTecnos = async ()=>{
  mostrarCarga(true);
  const res = await consulta({estado: "true"});
  mostrarCarga(false);
  if(res.resultado == 0){
    return console.log("se rompió algo no trajo las tecno");
  }
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

  datos.accion = 'crear';

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
  //mandar a buscarlo por filtros
};
