/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];

// Array de número de cartas
let numeros = [11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes
let tapeteInicial = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial = document.getElementById("contador_inicial");
let contSobrantes = document.getElementById("contador_sobrantes");
let contReceptor1 = document.getElementById("contador_receptor1");
let contReceptor2 = document.getElementById("contador_receptor2");
let contReceptor3 = document.getElementById("contador_receptor3");
let contReceptor4 = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0; // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset
document.getElementById("reset").onclick = comenzarJuego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
window.onload = comenzarJuego;

// Desarrollo del comienzo de juego
function comenzarJuego() {
  // Crear mazo inicial
  mazoInicial = [];

  // Vaciar resto de mazos
  mazoSobrantes = [];
  mazoReceptor1 = [];
  mazoReceptor2 = [];
  mazoReceptor3 = [];
  mazoReceptor4 = [];

  // Vaciar tapetes
  limpiarTapete(tapeteInicial);
  limpiarTapete(tapeteSobrantes);
  limpiarTapete(tapeteReceptor1);
  limpiarTapete(tapeteReceptor2);
  limpiarTapete(tapeteReceptor3);
  limpiarTapete(tapeteReceptor4);

  for (let palo of palos) {
    for (let numero of numeros) {
      let carta = document.createElement("img");
      carta.src = `../imagenes/baraja/${numero}-${palo}.png`;
      carta.classList.add("carta");
      carta.setAttribute("id", `${numero}-${palo}`);
      carta.setAttribute("data-palo", palo);
      carta.setAttribute("data-numero", numero);
      carta.draggable = true;
      carta.ondragstart = al_mover;
      carta.ondrag = function (e) {};
      carta.ondragend = function () {};
      mazoInicial.push(carta);
    }
  }

  // Barajar y dejar mazoInicial en tapete inicial
  mazoInicial = barajar(mazoInicial);
  cargarTapeteInicial(mazoInicial);

  // Puesta a cero de contadores de mazos
  setContador(contInicial, mazoInicial.length);
  setContador(contSobrantes, mazoSobrantes.length);
  setContador(contReceptor1, mazoReceptor1.length);
  setContador(contReceptor2, mazoReceptor2.length);
  setContador(contReceptor3, mazoReceptor3.length);
  setContador(contReceptor4, mazoReceptor4.length);
  setContador(contMovimientos, 0);

  // Arrancar el conteo de tiempo
  arrancarTiempo();
}

function arrancarTiempo() {
  if (temporizador) clearInterval(temporizador);
  let hms = function () {
    let seg = Math.trunc(segundos % 60);
    let min = Math.trunc((segundos % 3600) / 60);
    let hor = Math.trunc((segundos % 86400) / 3600);
    let tiempo =
      (hor < 10 ? "0" + hor : "" + hor) +
      ":" +
      (min < 10 ? "0" + min : "" + min) +
      ":" +
      (seg < 10 ? "0" + seg : "" + seg);
    setContador(contTiempo, tiempo);
    segundos++;
  };
  segundos = 0;
  hms();
  temporizador = setInterval(hms, 1000);
}

function barajar(mazo) {
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }
  return mazo;
}

function cargarTapeteInicial(mazo) {
  let top = 0;
  let left = 0;
  for (let carta of mazo) {
    carta.style.position = "absolute";
    carta.style.top = `${top}px`;
    carta.style.left = `${left}px`;
    tapeteInicial.appendChild(carta);
    top += paso;
    left += paso;
  }
  setContador(contInicial, mazo.length);
}

function incContador(contador) {
  contador.textContent = parseInt(contador.textContent) + 1;
}

function decContador(contador) {
  contador.textContent = parseInt(contador.textContent) - 1;
}

function setContador(contador, valor) {
  contador.textContent = valor;
}

function al_mover(e) {
  e.dataTransfer.setData(
    "text/plain/numero",
    e.target.getAttribute("data-numero")
  );
  e.dataTransfer.setData("text/plain/palo", e.target.getAttribute("data-palo"));
  e.dataTransfer.setData("text/plain/id", e.target.id);
}

function configurarEventosTapetes(tapetes) {
  for (let tapete of tapetes) {
    tapete.ondragenter = function (e) {
      e.preventDefault();
    };
    tapete.ondragover = function (e) {
      e.preventDefault();
    };
    tapete.ondragleave = function (e) {
      e.preventDefault();
    };
    tapete.ondrop = soltar;
  }
}

function soltar(e) {
  e.preventDefault();
  let carta_id = e.dataTransfer.getData("text/plain/id");
  let numero = e.dataTransfer.getData("text/plain/numero");
  let palo = e.dataTransfer.getData("text/plain/palo");
  let carta = document.getElementById(carta_id);

  let tapeteDestino = e.target.closest(".tapete");

  if (tapeteDestino && tapeteDestino.classList.contains("receptor")) {
    let mazoDestino;
    let contadorDestino;

    switch (tapeteDestino.id) {
      case "receptor1":
        mazoDestino = mazoReceptor1;
        contadorDestino = contReceptor1;
        break;
      case "receptor2":
        mazoDestino = mazoReceptor2;
        contadorDestino = contReceptor2;
        break;
      case "receptor3":
        mazoDestino = mazoReceptor3;
        contadorDestino = contReceptor3;
        break;
      case "receptor4":
        mazoDestino = mazoReceptor4;
        contadorDestino = contReceptor4;
        break;
      default:
        return;
    }

    let ultimaCarta = mazoDestino[mazoDestino.length - 1];
    if (mazoDestino.length === 0 && numero == 12) {
      moverCartaAlTapete(carta, tapeteDestino, mazoDestino, contadorDestino);
    } else if (ultimaCarta && esMovimientoValido(ultimaCarta, carta)) {
      moverCartaAlTapete(carta, tapeteDestino, mazoDestino, contadorDestino);
    }
  } else if (tapeteDestino && tapeteDestino.id === "sobrantes") {
    moverCartaAlTapete(carta, tapeteDestino, mazoSobrantes, contSobrantes);
  }
}

function esMovimientoValido(ultimaCarta, nuevaCarta) {
  let ultimoNumero = parseInt(ultimaCarta.dataset.numero);
  let ultimoPalo = ultimaCarta.dataset.palo;
  let nuevoNumero = parseInt(nuevaCarta.dataset.numero);
  let nuevoPalo = nuevaCarta.dataset.palo;

  let esSecuenciaDecreciente = nuevoNumero === ultimoNumero - 1;
  let esColorAlternado =
    ultimoPalo === "viu" || ultimoPalo === "cua"
      ? nuevoPalo === "hex" || nuevoPalo === "cir"
      : nuevoPalo === "viu" || nuevoPalo === "cua";

  return esSecuenciaDecreciente && esColorAlternado;
}

function moverCartaAlTapete(
  carta,
  tapeteDestino,
  mazoDestino,
  contadorDestino
) {
  let tapeteOrigen = carta.parentElement;
  if (tapeteOrigen.id === "inicial") {
    mazoInicial.pop();
    setContador(contInicial, mazoInicial.length);
  } else if (tapeteOrigen.id === "sobrantes") {
    mazoSobrantes.pop();
    setContador(contSobrantes, mazoSobrantes.length);
  }

  carta.style.position = "absolute";
  carta.style.top = "50%";
  carta.style.left = "50%";
  carta.style.transform = "translate(-50%, -50%)";
  tapeteDestino.appendChild(carta);
  mazoDestino.push(carta);
  setContador(contadorDestino, mazoDestino.length);
  incContador(contMovimientos);
}

function configurarEventosTapetes(tapetes) {
  for (let tapete of tapetes) {
    tapete.ondragenter = function (e) {
      e.preventDefault();
    };
    tapete.ondragover = function (e) {
      e.preventDefault();
    };
    tapete.ondragleave = function (e) {
      e.preventDefault();
    };
    tapete.ondrop = soltar;
  }
}

configurarEventosTapetes([
  tapeteSobrantes,
  tapeteReceptor1,
  tapeteReceptor2,
  tapeteReceptor3,
  tapeteReceptor4,
]);

function limpiarTapete(tapete) {
  const imagenes = tapete.querySelectorAll("img");
  imagenes.forEach((img) => img.remove());
}
