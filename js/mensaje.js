//mensaje que se muestra y oculta siempre en 3 seg
window.mostrarMensaje = (texto, tipo = "primary") => {
  const contenedor = document.getElementById("mensaje-global"); 
  const cuerpo     = document.getElementById("mensaje-texto");

  cuerpo.textContent = texto;

  contenedor.className = `toast align-items-center text-white border-0 position-fixed bottom-0 end-0 m-3 bg-${tipo}`;
  contenedor.style.display = "block";

  setTimeout(() => {
    contenedor.style.display = "none";
  }, 3000);
};