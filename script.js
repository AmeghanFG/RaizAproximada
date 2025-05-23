import { factorDeParo } from "./operaciones.js";

// Obtención de los elementos del DOM
const factorParo = document.getElementById("factorParo");
let labelIngresoFactorParo = document.getElementById("labelIngresoFactorParo");
let ingresoFactorParo = document.getElementById("ingresoFactorParo");
let mensajesError = document.getElementById("mensajesError");
let btnCalcular = document.getElementById("btnCalcular");

factorParo.addEventListener("change", () => {
  if (factorParo.value === "noIteraciones") {
    labelIngresoFactorParo.textContent = "Número de iteraciones";
  } else if (factorParo.value === "errorRelativo") {
    labelIngresoFactorParo.textContent = "Error relativo";
  } else {
    labelIngresoFactorParo.textContent = "Selección inválida";
  }
});

btnCalcular.addEventListener("click", (e) => {
  e.preventDefault();
  // Obtener los elementos del DOM para mostrar los resultados en la tabla
  const tbodyResults = document.getElementById("tbodyResults");
  const intervaloInferior = document.getElementById("intervaloA");
  const intervaloSuperior = document.getElementById("intervaloB");
  let valorFactorParo = "";

  if (factorParo.value == "errorRelativo") {
    valorFactorParo = "<";
  }
  valorFactorParo += ingresoFactorParo.value;

  try {
    if (validarIngresoFactorParo(valorFactorParo)) {
      // Enviar valores a la función
      let resultados = factorDeParo(
        valorFactorParo,
        parseFloat(intervaloInferior.value),
        parseFloat(intervaloSuperior.value)
      );

      tbodyResults.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos resultados

      resultados.forEach((aproximacion) => {
        // Creación de los elementos necesarios para mostrar los resultados en la tabla <tr> (fila) y <td> (celda)
        let trResultado = document.createElement("tr");
        let tdIteracion = document.createElement("td");
        let tdRaiz = document.createElement("td");
        let tdEa = document.createElement("td");

        // Pooner el resultado en sus elementos
        tdIteracion.textContent = aproximacion.iteration;
        tdRaiz.textContent = aproximacion.xr;
        tdEa.textContent = aproximacion.ea; // Valor
        // Validar que no se vea infinity
        if (aproximacion.ea == Infinity) {
          tdEa.textContent = "No aplica"; // Si es infinito, se muestra "no aplica"
        }
        if (isNaN(parseInt(aproximacion.xr))) {
          mensajesError.innerHTML = "El intervalo no aplicable";
          return;
        }

        // Añadir clases a los elementos para el estilo
        tdIteracion.classList.add(
          "w-1/6",
          "border",
          "border-blue-600",
          "px-3",
          "py-2",
          "text-wrap"
        );
        tdRaiz.classList.add(
          "w-1/6",
          "border",
          "border-blue-600",
          "px-3",
          "py-2",
          "text-wrap"
        );
        tdEa.classList.add(
          "w-1/6",
          "border",
          "border-blue-600",
          "px-3",
          "py-2",
          "text-wrap"
        );

        // Añadir los elementos a la fila y luego la fila al cuerpo de la tabla
        trResultado.appendChild(tdIteracion);
        trResultado.appendChild(tdRaiz);
        trResultado.appendChild(tdEa);
        tbodyResults.appendChild(trResultado);
      });
    }
  } catch (error) {
    console.error("Error al calcular el resultado:", error);
    mensajesError.textContent =
      "Error al calcular el resultado. Verifica los valores ingresados.";
    setTimeout(() => {
      mensajesError.textContent = "";
    }, 3000);
  }
}); // Fin de btnCalcular

// Validar que intervalo menor sea efectivamente menor que el intervalo mayor
function validarIngresoFactorParo(valorFactorParo) {
  if (factorParo.value === "noIteraciones") {
    if (valorFactorParo.includes(".")) {
      mensajesError.textContent =
        "No se admiten iteraciones con puntos decimales";
      return false;
    }
  } else if (factorParo.value === "errorRelativo") {
    if (valorFactorParo.includes(">")) {
      mensajesError.textContent = "No se puede pedir un error porcentual mayor";
      return false;
    }
  } else if (factorDeParo.value == NaN) {
    labelIngresoFactorParo.textContent = "Selección inválida";
  } else {
    labelIngresoFactorParo.textContent = "Selección de valores inválida";
  }
  return true;
}
// npm install vite -save-dev     ->          "dev": vite poner despues de test
