import { mostrarCarga } from "./js/loading.js";
import { consultaProyectos } from "./js/services/apiProyectos.js";
import { apiFetch } from "./js/api.js";

const contenedorJava  = document.getElementById("contenido-java");
const contenedorVue   = document.getElementById("contenido-vue");
const contenedorReact = document.getElementById("contenido-react");
const contenedorWp    = document.getElementById("contenido-wp");
const formContacto    = document.getElementById("form-contacto");
const mensajeContacto = document.getElementById("mensajeContacto");
let proyectos = [];

const obtenerProyectos = async () => {
  const datos = {
    estado: 'true'
  };
  
  mostrarCarga(true);
  const res = await consultaProyectos(datos);
  mostrarCarga(false);
  
  proyectos = res.proyectos;
} 

await obtenerProyectos();

const crearCarrusel = (url) => {
  //foto 1
  const img = document.createElement("img");
  img.setAttribute("src", `./imagenes/${url}/1.png`);
  img.setAttribute("alt","...");
  img.className = "d-block w-100";

  const divImg1     = document.createElement("div");
  divImg1.className = "carousel-item active";
  divImg1.appendChild(img);

  //foto 2
  const img2 = document.createElement("img");
  img2.setAttribute("src", `./imagenes/${url}/2.png`);
  img2.setAttribute("alt","...");
  img2.className = "d-block w-100";

  const divImg2     = document.createElement("div");
  divImg2.className = "carousel-item";
  divImg2.appendChild(img2);

  // foto 3
  const img3 = document.createElement("img");
  img3.setAttribute("src", `./imagenes/${url}/3.png`);
  img3.setAttribute("alt","...");
  img3.className = "d-block w-100";

  const divImg3     = document.createElement("div");
  divImg3.className = "carousel-item";
  divImg3.appendChild(img3);

  // inner
  const divInner    = document.createElement("div");
  divInner.className = "carousel-inner";
  divInner.appendChild(divImg1);
  divInner.appendChild(divImg2);
  divInner.appendChild(divImg3);
  
  //final
  const divCarr     = document.createElement("div");
  divCarr.className = "carousel slide";
  divCarr.setAttribute("data-bs-ride", "carousel");
  divCarr.appendChild(divInner);
 
  return divCarr;
};

const construirCardProyectos = async (contenedor, lista) => {

  const row     = document.createElement("div");
  row.className = "row";

  lista.forEach(e => {
    const col     = document.createElement("div");
    col.className = "col-lg-4 col-md-6 col-sm-12";

    const card     = document.createElement("div");
    card.className = "card m-2";

    const carruselImg = crearCarrusel(e.url_fotos);
    const divImg      = document.createElement("div");
    divImg.className  = "card-img-top";
    divImg.appendChild(carruselImg);

    const cardBody     = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle       = document.createElement("h5");
    cardTitle.className   = "card-title mb-3 text-wrap";
    cardTitle.textContent = e.nombre;

    const cardText = document.createElement("textarea");
    cardText.setAttribute("rows", "4");
    cardText.setAttribute("disabled", "");
    cardText.className   = "card-text form-control mb-3";
    cardText.textContent = e.descripcion;

    const cardTextTecno       = document.createElement("strong");
    cardTextTecno.className   = "fw-blod";
    cardTextTecno.textContent = "Técnologias: "+e.tecnologias.map(e=>e.nombre).join(", ");

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardTextTecno);

    card.appendChild(divImg);
    card.appendChild(cardBody);

    col.appendChild(card);

    row.appendChild(col);
  });

  contenedor.appendChild(row);
};

if (proyectos.length !== 0) {
  const agrupados = {
    Java: [],
    'Vue.js': [],
    React: [],
    Wordpress: []
  };

  // Clasificación
  for (const proyecto of proyectos) {
    if (!Array.isArray(proyecto.tecnologias)) continue;

    for (const tecnologia of proyecto.tecnologias) {
      const nombre = tecnologia.nombre;
      if (agrupados[nombre]) {
        agrupados[nombre].push(proyecto);
      }
    }
  }

  // Renderizado
  await construirCardProyectos(contenedorJava, agrupados.Java);
  await construirCardProyectos(contenedorVue, agrupados['Vue.js']);
  await construirCardProyectos(contenedorReact, agrupados.React);
  await construirCardProyectos(contenedorWp, agrupados.Wordpress);
}

/* Formulario de contacto */
const consultaPOST = async (payload) => {
  try {
    const data = await apiFetch("enviar_mail.php", {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return data;
  } catch (error) {
    return {
      resultado: 0,
      msj: error.message
    };
  }
}

const resetValores = () => {
  mensajeContacto.classList.add("d-none");
  formContacto.reset();
};

if(formContacto){
  formContacto.addEventListener("submit",async(e) => {

    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    //return console.log("datos: ", datos)

    mostrarCarga(true);
    const res = await consultaPOST(datos);
    mostrarCarga(false);

    mensajeContacto.classList.remove("d-none");
    const icono = document.createElement("i");
    const texto = document.createTextNode(res.msj);
    if(res.resultado == 0){
      mensajeContacto.classList.remove("alert-success");
      mensajeContacto.classList.add("alert-danger");
      icono.className = "fa-solid fa-circle-xmark"; 
    }else{
      mensajeContacto.classList.remove("alert-danger");
      mensajeContacto.classList.add("alert-success");
      icono.className = "fa-solid fa-circle-check"; 
    }
    mensajeContacto.appendChild(icono);
    mensajeContacto.appendChild(texto);

    setTimeout(() => {
      resetValores();
    }, 3000);
  });
}