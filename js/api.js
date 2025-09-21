//const BASE_URL   = "http://localhost:8080/portfolio/php/";
const BASE_URL = "https://rodrigo-miranda-portfolio.ct.ws/portfolio/php/";
console.log(BASE_URL);

export const apiFetch = async (endpoint, options={}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'/*,
      ...(token && {Authorization: `Bearer ${token}` })*/
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      ...options, // Extiende con las opciones proporcionadas (método, body, etc.)
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Respuesta no es JSON");
    }

    return await response.json();

  } catch (error) {
    console.log("Error al realizar la peticion: ", error);
    return { resultado:0, msj:"Error de conexión con el servidor." } 
  }
};