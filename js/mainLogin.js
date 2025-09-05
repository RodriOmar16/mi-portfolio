import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form      = document.querySelector(".contenedor-form");
  const emailUser = document.getElementById("emailUser");
  const pass      = document.getElementById("pass");
  //const boton     = document.getElementById("buttonLogin");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if(!emailUser.value || !pass.value){
      return console.log("mostrarme mensaje de rellenar campos");
    }
    iniciarValidarLogin(emailUser.value, pass.value);
    emailUser.value = null;
    pass.value = null;
  });
});

/*const iniciarValidarLogin = async (user, password) => {
  mostrarCarga(true,1);
  const res = await getUser({user, password})
  mostrarCarga(false,2);
  if(res.resultado == 0){
    document.getElementById("mensajeError").classList.remove("d-none");
    document.getElementById("mensajeError").textContent = res.msj;
  }else{
    localStorage.setItem("usuario", res.usuario);
    //redireccionar al backOffice.html
    window.location.href = "../html/backOffice.html";
  }
};*/
const iniciarValidarLogin = async (user, password) => {
  try {
    mostrarCarga(true, 1);
    const res = await getUser({ user, password });
    

    setTimeout(() => {
      mostrarCarga(false, 2);
    }, 10000);

    if (res.resultado == 0) {
      const divMensaje = document.getElementById("mensajeError");
      console.log("divMensaje: ", divMensaje)
      const icono = document.querySelector("#mensajeError i");
      console.log("icono: ", icono)
      
      divMensaje.classList.remove("d-none");
      divMensaje.textContent = res.msj;
    } else {
      localStorage.setItem("usuario", res.usuario);
      window.location.href = "../html/backOffice.html";
    }
  } catch (error) {
    mostrarCarga(false, 3);
    console.error("Error en la validación:", error);
    document.getElementById("mensajeError").classList.remove("d-none");
    document.getElementById("mensajeError").textContent = "Error de conexión con el servidor.";
  }
};


const getUser = async (payload) => {
  return await apiFetch('validar_login.php',{
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
