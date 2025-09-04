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
  });
});

const iniciarValidarLogin = async (user, password) => {
  const res = await getUser({user, password})
  if(res.resultado == 0){
    document.getElementById("mensajeError").classList.remove("d-none");
    document.getElementById("mensajeError").textContent = res.msj;
  }else{
    localStorage.setItem("usuario", res.usuario);
    //redireccionar al backOffice.html
    window.location.href = "../html/backOffice.html";
  }
};

const getUser = async (payload) => {
  return await apiFetch('login/validar_login.php',{
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
