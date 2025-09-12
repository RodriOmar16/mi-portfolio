import { apiFetch } from "../api.js";

export const consultaProyectos = async (payload) => {
  try {
    const params = new URLSearchParams();

    /*if (payload.id) params.append("id", payload.id);
    if (payload.nombre) params.append("nombre", payload.nombre);
    if (payload.estado) params.append("inhabilitada", payload.estado === "true" ? "0" : "1");*/

    const data = await apiFetch(`api_proyectos.php?${params.toString()}`, {
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

export const consultaPOST = async (payload) => {
  try {
    const data = await apiFetch("api_proyectos.php", {
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