import { apiFetch } from "./api";

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
obtenerTecnos();

/*mostrarCarga(true);
setTimeout(() => {
  mostrarCarga(false);
}, 500);*/

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
        document.getElementById("modal-nuevo-proyecto").classList.add("d-none");
        const nombreNuevo = document.getElementById("nombre-nuevo");
        const descriNuevo = document.getElementById("descripcion-nuevo");

        nombreNuevo.value = null;
        descriNuevo.value = null;
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