import { apiFetch } from "../api.js";

export const consultaProyectos = async (payload) => {
  try {
    const params = new URLSearchParams();

    if (payload.proyecto_id) params.append("proyecto_id", payload.proyecto_id);
    if (payload.nombre) params.append("nombre", payload.nombre);
    if (payload.estado) params.append("inhabilitada", payload.estado === "true" ? "0" : "1");
    if (payload.fecha_desde) params.append("fecha_desde", payload.fecha_desde);
    if (payload.fecha_hasta) params.append("fecha_hasta", payload.fecha_hasta);
    if (payload.tecnologia) params.append("tecnologia", payload.tecnologia);
    
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