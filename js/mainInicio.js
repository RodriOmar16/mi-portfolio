const botones = document.querySelectorAll('button');

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    const vista = boton.id//.dataset.view;
    if (typeof cargarVistas === "function") {
      cargarVistas(vista);
    } else {
      console.warn("cargarVistas no está disponible.");
    }
  });
});