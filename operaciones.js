export function factorDeParo(factor, xl, xu) {
    let _a, _b;
    /* -------------------- Declaración de arrays de objetos -------------------- */
    let tabulador = [];
    let resultado = [];
    /* ---------------------- Inicializacion del tabulador ---------------------- */
    addToTabulador(tabulador, xl);
    addToTabulador(tabulador, xu);
    /* ------------------------ Declaracion de variables ------------------------ */
    let ea; // error relativo
    let xrNuevo = 0; // para error relativo
    let xrViejo; // para error relativo
    let PosiNega; // Par de números positivo y negativo
    let seraIteracion = /^[0-9]+$/.test(factor); // RegExp busca que en todo el texto solo hayan números, .test(variable) se usa para probar dicho RegExp en la variable regresando un Boolean
    let numeroDeIteraciones = Number(factor); // Convierte el texto en número
    if (seraIteracion) { // En caso de que sí sea por iteracion
        for (let i = 1; i <= numeroDeIteraciones; i++) { // i representa la iteracion
            PosiNega = obtainPositiveAndNegative(tabulador); // Obtengo los valores desde el tab
            xrViejo = xrNuevo; //Guardo el que tenia
            xrNuevo = xr(PosiNega[0], PosiNega[1]); //Genero uno nuevo
            ea = (i == 1) ? Infinity : errorRelativo(xrNuevo, xrViejo);
            addToTabulador(tabulador, xrNuevo);
            resultado.push({ iteration: i, xr: xrNuevo, ea: ea }); //Guardo el resultado
        }
        return resultado;
    }
    else {
        /* -------------------------- Si es por porcentaje -------------------------- */
        let operadorMatch = (_a = factor.match(/^(<=?|>=?|==|!=)/)) === null || _a === void 0 ? void 0 : _a[0];
        let operador = operadorMatch ? operadorMatch.trim() : '';
        // Para ubicar si tiene operador, ?. se usa para acceder al valor solo si éste no es null o 'unidentified' de lo contrario arroja 'unitendified' en lugar de error, ?? se usa en caso de que la sección izquierda al mismo sea 'unidentified', en caso de serlo, arroja el valor de la derecha
        let valorStr = factor.replace(/^(<=?|>=?|==|!=)\s*/, '');
        let valor = parseFloat(valorStr); //Para quitar dicho operador
        let condiciones = {
            '<': function (ea, valor) { return ea > valor; },
            '<=': function (ea, valor) { return ea >= valor; },
            '>': function (ea, valor) { return ea < valor; },
            '>=': function (ea, valor) { return ea <= valor; },
            '==': function (ea, valor) { return ea === valor; },
            '!=': function (ea, valor) { return ea !== valor; },
            '': function (_, __, iteration) { return iteration <= 100; } // Límite máximo de seguridad
        };
        let FDP = (_b = condiciones[operador]) !== null && _b !== void 0 ? _b : condiciones['']; // En base al registro obtiene la operación a usar, en caso de ser indefinido arroja la opción por default, que en este caso es ''
        let iteration = 0; // numero de iteraciones
        do {
            iteration++; // Obtengo iteración
            if (iteration > 100) { // Límite máximo de iteraciones
                console.warn('Límite máximo de iteraciones alcanzado');
                break;
            }
            PosiNega = obtainPositiveAndNegative(tabulador); // Obtengo los valores desde el tab
            xrViejo = xrNuevo; //Guardo el que tenia
            xrNuevo = xr(PosiNega[0], PosiNega[1]); //Genero uno nuevo
            ea = (iteration == 1) ? Infinity : errorRelativo(xrNuevo, xrViejo);
            addToTabulador(tabulador, xrNuevo);
            resultado.push({ iteration: iteration, xr: xrNuevo, ea: ea }); //Guardo el resultado
        } while (FDP(ea, valor, iteration));
        return resultado;
    }
}
function biseccion() { }
function addToTabulador(tab, x) {
    tab.push({ x: x, fx: (Math.pow(x, 3)) + (Math.pow(x, 2)) - (3 * x) - 3 });
}
function obtainPositiveAndNegative(ob) {
    let res = [];
    ob.sort(function (a, b) { return a.x - b.x; }); //ordenar Xs
    for (let i = 0; i < ob.length - 1; i++) { // Obtener Xs de los FXs necesarios
        let act = ob[i].fx;
        let sig = ob[i + 1].fx;
        if (act < 0 && sig > 0) {
            res = [ob[i].x, ob[i + 1].x];
            break;
        }
    }
    return res;
}
function xr(xl, xu) {
    return (xl + xu) / 2;
}
function errorRelativo(xrNuevo, xrViejo) {
    return Math.abs((xrNuevo - xrViejo) / xrNuevo) * 100;
}
// console.log(factorDeParo('5', -3, 3));

