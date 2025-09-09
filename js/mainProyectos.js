//import { apiFetch } from "./api.js";
import { consulta } from "./mainTecnologias.js";

//obtener datos principales
let tecnologias = [];
const obtenerTecnos = async ()=>{
  mostrarCarga(true);
  const res = await consulta({estado: "true"});
  mostrarCarga(false);
  if(res.resultado == 0){
    return console.log("se rompió algo no trajo las tecno");
  }
  tecnologias = res.tecnologias;
  //construir las options dinamico
};
obtenerTecnos();

// acciones del boton buscar: form-buscar

/*mostrarCarga(true);
setTimeout(() => {
  mostrarCarga(false);
}, 500);*/

//Modal nuevo proyecto y acciones
const modalNuevoProyecto = document.getElementById("modal-nuevo-proyecto");

const resetearValores = () => {
  modalNuevoProyecto.classList.add("d-none");
  const nombreNuevo = document.getElementById("nombre-nuevo");
  const descriNuevo = document.getElementById("descripcion-nuevo");

  nombreNuevo.value = null;
  descriNuevo.value = null;
};

const buttonNuevo  = document.getElementById("button-nuevo");
if(buttonNuevo){
  buttonNuevo.addEventListener("click", () => {
    
    if(modalNuevoProyecto){
      modalNuevoProyecto.classList.remove("d-none");
    }
    const cancelButton = document.getElementById("cancelarModal");
    const formModal    = document.getElementById("form-nuevo-proyecto");
    if(cancelButton){
      cancelButton.addEventListener("click", () => {
        resetearValores();
      });
    }
    if(formModal){
      formModal.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target));
        console.log("datos: ", datos)
      });
    }
  });
}

const buttonCerrar = document.getElementById("cerrar-icon");
if(buttonCerrar){
  buttonCerrar.addEventListener("click", () =>{
    resetearValores();
  });
}
