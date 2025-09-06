console.log("hola mundo desde proyectos")
mostrarCarga(true);

setTimeout(() => {
  mostrarCarga(false);
}, 500);

const buttonNuevo  = document.getElementById("button-nuevo");
if(buttonNuevo){
  buttonNuevo.addEventListener("click", () => {
    console.log("entro")
    const modalNuevoProyecto = document.getElementById("modal-nuevo-proyecto");
    if(modalNuevoProyecto){
      modalNuevoProyecto.classList.remove("d-none");
    }
    //document.getElementById("modal-nuevo-proyecto").classList.remove("d-none");
    const cancelButton = document.getElementById("cancelarModal");
    const formModal    = document.getElementById("form-nuevo-proyecto");
    if(cancelButton){
      cancelButton.addEventListener("click", () => {
        document.getElementById("modal-nuevo-proyecto").classList.add("d-none");
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