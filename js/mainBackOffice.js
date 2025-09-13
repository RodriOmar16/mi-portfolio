
const controlRuta = async() => {
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
  const name = localStorage.getItem("usuario");
  const encabezado = document.getElementById("user-name");
  encabezado.textContent = name;
};
cargarInfoUser();

//---------------------------------------------------
const contenedor = document.getElementById("contenedor-vistas");
const enlaces    = document.querySelectorAll("nav a");

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

window.cargarVistas = cargarVistas;
cargarVistas("inicio");

//-----------------------------
const buttonSalir = document.getElementById("button-salir");
if (buttonSalir) {
  buttonSalir.addEventListener("click", async () => {
    console.log("entrooo")
    try {
      const res = await fetch('../php/cerrar_sesion.php', {
        credentials: 'include'
      });
      if (res.ok) {
        localStorage.removeItem("usuario");
        window.location.href = '/portfolio/index.html';
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error general al cerrar sesión:", error);
    }
  });
}
