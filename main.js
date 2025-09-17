import { mostrarCarga } from "./js/loading.js";
import { consultaProyectos } from "./js/services/apiProyectos.js";

const contenedorProyectos = document.getElementById("proyectos");
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

console.log("proyectos - main de main: ", proyectos)
const construirCardProyectos = async () => {

  const row = document.createElement("div");
  row.className = "row";

  proyectos.forEach(e => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 col-sm-12";

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.setAttribute("src", "");
    img.setAttribute("alt", "...");
    img.className = "card-img-top";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = e.nombre;

    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = e.descripcion;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    card.appendChild(img);
    card.appendChild(cardBody);

    col.appendChild(card);

    row.appendChild(col);
  });

  contenedorProyectos.appendChild(row);
};
/*
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
*/
await construirCardProyectos();