import { apiFetch } from "./api.js";

//modal nueva y acciones
const modalNuevaTecno    = document.getElementById("modal-nueva-tecnologia");
const modalEditarTecno   = document.getElementById("modal-editar-tecnologia");
const formModal          = document.getElementById("form-nuevo");
const formEditar         = document.getElementById("form-editar");
const formBuscar         = document.getElementById("form-buscar");
const buttonNuevo        = document.getElementById("button-nuevo");
const buttonCerrarNuevo  = document.getElementById("cerrar-icon");
const buttonCancelNuevo  = document.getElementById("cancelarModal"); 
const buttonCerrarEditar = document.getElementById("cerrar-editar");
const buttonCancelEditar = document.getElementById("cancelarEditar"); 
const buttonLimpiar      = document.getElementById("limpiar");
const inputBusqueda      = document.getElementById("busqueda");
let tecnologias          = [];

const resetearValores = () => {
  modalNuevaTecno.classList.add("d-none");
  formModal.reset(); 
};
const resetearValoresEditar = () => {
  modalEditarTecno.classList.add("d-none");
  formEditar.reset(); 
};

if (buttonNuevo) {
  buttonNuevo.addEventListener("click", () => {
    modalNuevaTecno.classList.remove("d-none");
  });
}

if (buttonCerrarNuevo) {
  buttonCerrarNuevo.addEventListener("click", () => {
    resetearValores();
  });
}

if (buttonCancelNuevo) {
  buttonCancelNuevo.addEventListener("click", () => {
    resetearValores();
  });
}

if (buttonCerrarEditar) {
  buttonCerrarEditar.addEventListener("click", () => {
    resetearValoresEditar();
  });
}

if (buttonCancelEditar) {
  buttonCancelEditar.addEventListener("click", () => {
    resetearValoresEditar();
  });
}

if (formModal) {
  formModal.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    await crearNuevaTecno(datos);
  });
}

if (formBuscar) {
  formBuscar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    await getTecnologias(datos);
  });
}

if(buttonLimpiar){
  buttonLimpiar.addEventListener("click", () =>{
    formBuscar.reset();
  });
}

if(inputBusqueda){
  inputBusqueda.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = tecnologias.filter(e => e.nombre.toLowerCase().includes(texto) || 
      String(e.tecnologia_id).includes(texto)
    );
    renderizarResultados(filtrados);
  });
}

const renderizarResultados = (lista) => {

  const tbody = document.getElementById("tbody-resultados");
  tbody.innerHTML = "";

  if(lista.length == 0){
    const trSinDatos  = document.createElement("tr");
    const tdSinDatos  = document.createElement("td");
    tdSinDatos.setAttribute("colspan", "4");
    
    const divSinDatos = document.createElement("div");
    divSinDatos.className = "w-60 mt-3 alert d-flex align-items-center justify-content-center text-wrap fs-5";
    divSinDatos.id = "sin-resultados";
    
    const icono = document.createElement("i");
    icono.className = "fa-solid fa-triangle-exclamation";
    divSinDatos.appendChild(icono);

    const texto = document.createTextNode(" No hay resultados para mostrar");
    divSinDatos.appendChild(texto);

    tdSinDatos.appendChild(divSinDatos);
    trSinDatos.appendChild(tdSinDatos);
    tbody.appendChild(trSinDatos);
    return;
  }
  lista.forEach(e => {
    const fila     = document.createElement("tr");
    
    const id       = document.createElement("th");
    id.setAttribute("scope", "row");
    id.setAttribute("data-label", "ID");
    id.textContent = e.tecnologia_id;
    fila.appendChild(id);

    const nombre   = document.createElement("td");
    nombre.setAttribute("data-label", "Nombre");
    nombre.textContent = e.nombre;
    fila.appendChild(nombre);

    const estado   = document.createElement("td");
    estado.setAttribute("data-label", "Estado");
    estado.textContent = e.ihabilitada == 0 ? 'Activo' : 'Inactiva';
    fila.appendChild(estado);

    const acciones = document.createElement("td");
    acciones.setAttribute("data-label", "Acciones");
    acciones.classList.add("row-acciones-tecno");

    const span = document.createElement("span");

    if(e.inhabilitada == 0){
      const iconoEditar = document.createElement("i");
      iconoEditar.id = `editar-${e.tecnologia_id}`;
      iconoEditar.setAttribute("type", "button");
      iconoEditar.setAttribute("title", "Editar");
      iconoEditar.className = "fa-solid fa-pencil me-1 text-warning";
      iconoEditar.setAttribute("data-bs-toggle","tooltip");
      iconoEditar.setAttribute("data-bs-placement","bottom");
      iconoEditar.setAttribute("data-bs-title","Editar");
      iconoEditar.addEventListener("click", () => {
        ejecutarEdicion(e.tecnologia_id);
      });
      span.appendChild(iconoEditar);
    }

    const iconoBloc   = document.createElement("i");
    iconoBloc.id = `blocked-${e.tecnologia_id}`;
    iconoBloc.setAttribute("type", "button");
    iconoBloc.setAttribute("title", e.inhabilitada == 0 ? "Inhabilitar" : "Habilitar");
    iconoBloc.className =  e.inhabilitada == 0 ? "fa-solid fa-ban text-danger" : "fa-solid fa-check text-success";
    iconoBloc.setAttribute("data-bs-toggle","tooltip");
    iconoBloc.setAttribute("data-bs-placement","bottom");
    iconoBloc.setAttribute("data-bs-title",e.inhabilitada == 0 ? "Inhabilitar" : "Habilitar");
    iconoBloc.addEventListener("click", () => {
      if(e.inhabilitada == 0){
        ejecutarBloqueo(e.tecnologia_id);
      }else ejecutarDesbloqueo(e.tecnologia_id);
    });
    span.appendChild(iconoBloc);

    acciones.appendChild(span);
    fila.appendChild(acciones);

    tbody.appendChild(fila);
  }); 
};

//CREAR NUEVO 
const consultaPOST = async (payload) => {
  try {
    const data = await apiFetch("api_tecnologias.php", {
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
const crearNuevaTecno = async (datos) => {
  datos.accion = 'crear';
  mostrarCarga(true);
  const res = await consultaPOST(datos);
  mostrarCarga(false);

  if(res.resultado == 0){
    return Swal.fire({
      title: 'Error al crear nueva Tecnología',
      text: 'Ocurrió un error inesperado al crear la tecnología: '+res.msj,
      icon: 'error'
    });
  }
  Swal.fire({
    title: 'Nueva Tecnología',
    text: 'Se creó correctamente la tecnología.',
    icon: 'success'
  });
  resetearValores();
};

//OBTENER TECNOS
export const consulta = async (payload) => {
  try {
    const params = new URLSearchParams();

    if (payload.id) params.append("id", payload.id);
    if (payload.nombre) params.append("nombre", payload.nombre);
    if (payload.estado) params.append("inhabilitada", payload.estado === "true" ? "0" : "1");

    const data = await apiFetch(`api_tecnologias.php?${params.toString()}`, {
      method: 'GET'
    });

    return data;
  } catch (error) {
    return {
      resultado: 0,
      msj: error.message
    };
  }
}
const getTecnologias = async (filtros) => {
  if (filtros.id) filtros.id = parseInt(filtros.id);
  
  mostrarCarga(true);
  const res = await consulta(filtros);
  mostrarCarga(false);
  tecnologias = res.tecnologias;
  renderizarResultados(tecnologias);
};

const ejecutarEdicion = (id) => {
  modalEditarTecno.classList.remove("d-none");
  const tecno = tecnologias.find(e => e.tecnologia_id == id);
  console.log("tecno: ", tecno)
  for(const [clave, valor] of Object.entries(tecno)){
    const campo = formEditar.elements[clave];
    if(campo) {
      if(clave == "inhabilitada"){
        campo.value = valor == 0 ? true : false;
      }else campo.value = valor;
      
    };
  }
  console.log("editando...")
};

const ejecutarBloqueo = async (id) => {
  const tecno = tecnologias.find(e => e.tecnologia_id == id);
  if (!tecno) return;

  const result = await Swal.fire({
    title: 'Confirmar acción',
    html: `¿Estás seguro de inhabilitar <strong>${tecno.nombre}</strong>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#0D6EFD",
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  let datos = { id, accion: 'bloquear' };

  mostrarCarga(true);
  const res = await consultaPOST(datos);
  mostrarCarga(false);

  if (res.resultado === 0) {
    return await Swal.fire({
      title: 'Error de bloqueo',
      text: res.msj,
      icon: 'error',
      confirmButtonText: 'Ok',
      confirmButtonColor: "#0D6EFD"
    });
  }

  await Swal.fire({
    title: 'Bloqueo exitoso',
    html: `Se inhabilitó correctamente la tecnología <strong>${tecno.nombre}</strong>`,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#198754"
  });
};


const ejecutarDesbloqueo = async (id) => {
  const tecno = tecnologias.find(e => e.tecnologia_id == id);
  if (!tecno) return;

  const result = await Swal.fire({
    title: 'Confirmar acción',
    html: `¿Estás seguro de habilitar <strong>${tecno.nombre}</strong>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#0D6EFD",
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  let datos = { id, accion: 'desbloquear' };

  mostrarCarga(true);
  const res = await consultaPOST(datos);
  mostrarCarga(false);

  if (res.resultado === 0) {
    return await Swal.fire({
      title: 'Error al desbloquear',
      text: res.msj,
      icon: 'error',
      confirmButtonText: 'Ok',
      confirmButtonColor: "#0D6EFD"
    });
  }

  await Swal.fire({
    title: 'Desbloqueo exitoso',
    html: `Se habilitó correctamente la tecnología <strong>${tecno.nombre}</strong>`,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: "#198754"
  });
};