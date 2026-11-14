const API = "https://api.restcountries.com/countries/v5";
const CLAVE = "rc_live_dde450e19eac41768b0eeb5dea314614";

async function buscarPais(nombre) {
    const url = `${API}?q=${encodeURIComponent(nombre)}`;
    const respuesta = await fetch(url, {
        headers: { Authorization: `Bearer ${CLAVE}` }
    });
    if (!respuesta.ok) {
        throw new Error(`Error del servidor (código ${respuesta.status}).`);
    }
    const datos = await respuesta.json();
    if (!datos.data || datos.data.objects.length === 0) {
        throw new Error("No se encontró ningún país con ese nombre.");
    }
    return datos.data.objects;
}

function mostrarPaises(paises) {
    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = "";
    paises.forEach(pais => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";
        tarjeta.innerHTML = `
            <img src="${pais.flag.url_png}" alt="Bandera de ${pais.names.common}">
            <h3>${pais.names.common}</h3>
            <p><b>Capital:</b> ${pais.capitals && pais.capitals.length > 0 ? pais.capitals[0].name : "Sin capital"}</p>
            <p><b>Región:</b> ${pais.region}</p>
            <p><b>Población:</b> ${pais.population ? pais.population.toLocaleString("es-MX") : "Sin dato"}</p>
        `;
        contenedor.appendChild(tarjeta);
    });
}

const form = document.getElementById("formBuscar");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("txtPais").value.trim();
    mensaje.textContent = "Cargando...";
    try {
        const paises = await buscarPais(nombre);
        mostrarPaises(paises);
        mensaje.textContent = `${paises.length} resultado(s)`;
    } catch (error) {
        document.getElementById("resultados").innerHTML = "";
        mensaje.textContent = error.message;
    }
});