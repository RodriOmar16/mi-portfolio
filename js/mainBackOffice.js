const contenedor = document.getElementById("contenedor-vistas");
const vistasPermitidas = ["inicio", "proyectos", "tecnologias"];

const controlRuta = async () => {
  try {
    const res = await fetch('../php/validar_sesion.php', {
      credentials: 'include'
    });
    if (!res.ok) {
      console.log("denegado");
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.log("error general");
  }
};

const cargarInfoUser = () => {
  const name = localStorage.getItem("usuario");
  const encabezado = document.getElementById("user-name");
  if (encabezado) encabezado.textContent = name;
};

export const cargarVistas = async (nombreVista) => {
  if(!nombreVista){
    return 
  }

  if (nombreVista && !vistasPermitidas.includes(nombreVista)) {
    console.log("entro de la funcion")
    contenedor.innerHTML = `<p class="alert alert-warning">Vista <strong>${nombreVista}</strong> no permitida.</p>`;
    return;
  }

  try {
    const res = await fetch(`views/${nombreVista}.html`);
    const htmlVista = await res.text();
    const temp = document.createElement("div");
    temp.innerHTML = htmlVista;

    const elementosValidos = Array.from(temp.childNodes).filter(n => n.nodeType === 1);
    contenedor.replaceChildren(...elementosValidos);

    const scriptId = 'script-vista';
    const scriptPrevio = document.getElementById(scriptId);
    if (scriptPrevio) scriptPrevio.remove();

    const script = document.createElement("script");
    script.type = "module";
    script.src = `../js/main${nombreVista.charAt(0).toUpperCase() + nombreVista.slice(1)}.js?ts=${Date.now()}`;
    script.id = scriptId;

    script.onload = () => {
      const nombreFuncion = `init${nombreVista.charAt(0).toUpperCase() + nombreVista.slice(1)}`;
      if (typeof window[nombreFuncion] === 'function') {
        window[nombreFuncion]();
      }
    };

    document.body.appendChild(script);
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar la vista.</p>";
    console.error("Error al cargar la vista:", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  window.cargarVistas = cargarVistas;

  await controlRuta();
  cargarInfoUser();
  cargarVistas("inicio");

  const buttonSalir = document.getElementById("button-salir");
  if (buttonSalir) {
    buttonSalir.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await fetch("../php/cerrar_sesion.php", { credentials: "include" });
        window.location.href = "/portfolio/index.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    });
  }

  const enlaces = document.querySelectorAll("nav a[data-view]");
  enlaces.forEach(e => {
    e.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const vista = e.dataset.view;
      if (typeof vista !== "string" || vista.trim() === "" || !vistasPermitidas.includes(vista)) {
        return; // no hagas nada si no es una vista válida
      }

      contenedor.classList.add("fade-out");
      setTimeout(async () => {
        await cargarVistas(vista);
        contenedor.classList.remove("fade-out");
      }, 150);

      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: true });
        bsCollapse.hide();
      }

    });
  });
});
