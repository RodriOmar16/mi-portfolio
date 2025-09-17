/*const controlRuta = async() => {
  try {
    const res = await fetch('../php/validar_sesion.php',{
      credentials: 'include'
    });
    if(!res.ok){
      console.log("denegado")
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.log("error general")
  }
};
await controlRuta();

const cargarInfoUser = () => {
  const name             = localStorage.getItem("usuario");
  const encabezado       = document.getElementById("user-name");
  encabezado.textContent = name;
};
cargarInfoUser();

//---------------------------------------------------

const contenedor = document.getElementById("contenedor-vistas");
const enlaces    = document.querySelectorAll("nav a");

window.cargarVistas = cargarVistas;
cargarVistas("inicio");

export const cargarVistas = async (nombreVista) => {
  try {
    const res       = await fetch(`views/${nombreVista}.html`);
    const htmlVista = await res.text();
    const temp      = document.createElement("div");
    temp.innerHTML  = htmlVista;

    const elementosValidos = Array.from(temp.childNodes).filter(n => n.nodeType === 1);
    contenedor.replaceChildren(...elementosValidos);

    const scriptId     = 'script-vista';
    const scriptPrevio = document.getElementById(scriptId);
    if(scriptPrevio) scriptPrevio.remove();

    const script = document.createElement("script");
    script.type  = "module";
    script.src   = `../js/main${nombreVista.charAt(0).toUpperCase() + nombreVista.slice(1)}.js?ts=${Date.now()}`;
    script.id    = scriptId;

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

enlaces.forEach(e => {
  e.addEventListener("click", (ev) => {
    ev.preventDefault();
    const vista = e.dataset.view;

    contenedor.classList.add("fade-out");
    setTimeout(async () => {
      await cargarVistas(vista);
      contenedor.classList.remove("fade-out");
    }, 150);
  })
});

//-----------------------------
const buttonSalir = document.getElementById("button-salir");
if (buttonSalir) {
  buttonSalir.addEventListener("click", async (e) => {
    try {
      e.preventDefault(); // ← esto es clave
      e.stopPropagation(); 
      try {
        await fetch("../php/cerrar_sesion.php", { credentials: "include" });
        window.location.href = "/portfolio/index.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    } catch (error) {
      console.error("Error general al cerrar sesión:", error);
    }
  });
}*/

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
  if (!vistasPermitidas.includes(nombreVista)) {
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

  const enlaces = document.querySelectorAll("nav a");
  enlaces.forEach(e => {
    e.addEventListener("click", (ev) => {
      ev.preventDefault();

      const vista = e.dataset.view;
      if (!vistasPermitidas.includes(vista)) {
        contenedor.innerHTML = `<p class="alert alert-warning">Vista <strong>${vista}</strong> no permitida.</p>`;
        return;
      }

      contenedor.classList.add("fade-out");
      setTimeout(async () => {
        await cargarVistas(vista);
        contenedor.classList.remove("fade-out");
      }, 150);
    });
  });
});
