/* -------------------- Declaracion de formatos para arrays de objetos -------------------- */
type XAndFX = {x: number, fx:number};
type resultsFormat = {iteration: number, xr: number, ea: number};


function factorDeParo(factor: string, xl: number, xu: number): resultsFormat[] {
/* -------------------- Declaración de arrays de objetos -------------------- */
let tabulador: XAndFX[] = [];
let resultado: resultsFormat[] = [];
/* ---------------------- Inicializacion del tabulador ---------------------- */
    addToTabulador(tabulador, xl);
    addToTabulador(tabulador, xu);

/* ------------------------ Declaracion de variables ------------------------ */
    let ea: number;             // error relativo
    let xrNuevo: number = 0;    // para error relativo
    let xrViejo: number;        // para error relativo
    let PosiNega: number[];     // Par de números positivo y negativo


    const seraIteracion = /^[0-9]+$/.test(factor);  // RegExp busca que en todo el texto solo hayan números, .test(variable) se usa para probar dicho RegExp en la variable regresando un Boolean
    const numeroDeIteraciones = Number(factor);     // Convierte el texto en número

    if(seraIteracion) { // En caso de que sí sea por iteracion
        for(let i = 1; i <= numeroDeIteraciones; i++) { // i representa la iteracion
            PosiNega = obtainPositiveAndNegative(tabulador);    // Obtengo los valores desde el tab
            xrViejo = xrNuevo;      //Guardo el que tenia
            xrNuevo = xr(PosiNega[0], PosiNega[1]); //Genero uno nuevo
        
            ea = (i == 1) ? Infinity : errorRelativo(xrNuevo, xrViejo); 

            addToTabulador(tabulador, xrNuevo);
            resultado.push({iteration: i, xr: xrNuevo, ea: ea});    //Guardo el resultado
        }
        return resultado;
    } else{
/* -------------------------- Si es por porcentaje -------------------------- */
    const operadorMatch = factor.match(/^(<=?|>=?|==|!=)/)?.[0];
    const operador = operadorMatch ? operadorMatch.trim() : '';
   // Para ubicar si tiene operador, ?. se usa para acceder al valor solo si éste no es null o 'unidentified' de lo contrario arroja 'unitendified' en lugar de error, ?? se usa en caso de que la sección izquierda al mismo sea 'unidentified', en caso de serlo, arroja el valor de la derecha
    const valorStr = factor.replace(/^(<=?|>=?|==|!=)\s*/, '');
    const valor = parseFloat(valorStr);   //Para quitar dicho operador

    const condiciones: Record<string, (ea: number, valor: number, iteration: number) => boolean> = { // Crea un registro en base al string recibido, crea una condición con las variables ingresadas y regresa un boolean, éste registro se crea a partir de lo que se generó en operador
    '<': (ea, valor) => ea > valor,
    '<=': (ea, valor) => ea >= valor,
    '>': (ea, valor) => ea < valor,
    '>=': (ea, valor) => ea <= valor,
    '==': (ea, valor) => ea === valor,
    '!=': (ea, valor) => ea !== valor,
    '': (_, __, iteration) => iteration <= 100 // Límite máximo de seguridad
};

    const FDP = condiciones[operador] ?? condiciones[''];   // En base al registro obtiene la operación a usar, en caso de ser indefinido arroja la opción por default, que en este caso es ''

    let iteration:number = 0;   // numero de iteraciones
    do{
        iteration++;    // Obtengo iteración
        if (iteration > 100) { // Límite máximo de iteraciones
            console.warn('Límite máximo de iteraciones alcanzado');
            break;
        }
        PosiNega = obtainPositiveAndNegative(tabulador);    // Obtengo los valores desde el tab
        xrViejo = xrNuevo;      //Guardo el que tenia
        xrNuevo = xr(PosiNega[0], PosiNega[1]); //Genero uno nuevo
        
        ea = (iteration == 1) ? Infinity : errorRelativo(xrNuevo, xrViejo); 

        addToTabulador(tabulador, xrNuevo);
        resultado.push({iteration: iteration, xr: xrNuevo, ea: ea});    //Guardo el resultado

    } while(FDP(ea, valor, iteration));
    return resultado;
    }

}

function biseccion() {}

function addToTabulador(tab: XAndFX[], x: number) {
    tab.push({x, fx:(Math.pow(x, 3)) + (Math.pow(x, 2)) - (3 * x) - 3});
}

function obtainPositiveAndNegative(ob: XAndFX[]) {  // Si jala
    let res = [] as number[];
    
    ob.sort((a, b) => a.x - b.x);   //ordenar Xs
    
    for (let i = 0; i < ob.length - 1; i++) {   // Obtener Xs de los FXs necesarios
        const act = ob[i].fx;
        const sig = ob[i + 1].fx;
        if (act < 0 && sig > 0) {
            res = [ob[i].x, ob[i+1].x];
            break;
        }
    }
    return res;
}

function xr(xl: number, xu: number): number {       // Si jala
    return (xl + xu) / 2;
}

function errorRelativo(xrNuevo: number, xrViejo: number): number {  // Si jala
    return Math.abs((xrNuevo - xrViejo) / xrNuevo) * 100;
}

console.log(factorDeParo('5', -3, 3));
console.log(factorDeParo('<= 0.1', -3, 3));