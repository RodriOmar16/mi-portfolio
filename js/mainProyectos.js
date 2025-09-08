import { apiFetch } from "./api.js";

const tecnologias = [];

const getTecnologias = () => {
  return new Promise (async (resolve, reject) => {
    try {
      const res = await apiFetch("api_proyectos.php",{
        method: 'GET', 
        body: null
      });
      const data = await res.json();
      resolve({
        resultado: 1,
        msj: 'OK',
        tecnologias: data.tecnologias
      });

    } catch (error) {
      resolve({
        resultado: 0,
        msj: "Ocurrió un error al intentar obtener las técnologias: "+error.message,
      });
    }
  });
};

const obtenerTecnos = async ()=>{
  mostrarCarga(true);
  const res = await getTecnologias();
  mostrarCarga(false);
  if(res.resultado == 0){
    return console.log("se rompió algo no trajo las tecno");
  }
  tecnologias = res.tecnologias;
};
//obtenerTecnos();

/*mostrarCarga(true);
setTimeout(() => {
  mostrarCarga(false);
}, 500);*/

const resetearValores = () => {
  document.getElementById("modal-nuevo-proyecto").classList.add("d-none");
  const nombreNuevo = document.getElementById("nombre-nuevo");
  const descriNuevo = document.getElementById("descripcion-nuevo");

  nombreNuevo.value = null;
  descriNuevo.value = null;
};

const buttonNuevo  = document.getElementById("button-nuevo");
if(buttonNuevo){
  buttonNuevo.addEventListener("click", () => {
    
    const modalNuevoProyecto = document.getElementById("modal-nuevo-proyecto");
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
//Swal.fire('¡Guardado!', 'El proyecto fue creado con éxito.', 'success');
Swal.fire({
  title: '¿Estás seguro?',
  text: 'Esta acción no se puede deshacer.',
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.isConfirmed) {
    // ejecutar delete
  }
});
