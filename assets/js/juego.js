const miModulo = (() => {
    'use strict';

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];
    let turnoActual = 0;

    // Referencias HTML
    const btnPedir1 = document.querySelector('#btnPedir1'),
          btnDetener1 = document.querySelector('#btnDetener1'),
          btnPedir2 = document.querySelector('#btnPedir2'),
          btnDetener2 = document.querySelector('#btnDetener2'),
          btnNuevo = document.querySelector('#btnNuevo'),
          divCartasJugador1 = document.querySelector('#jugador1-cartas'),
          divCartasJugador2 = document.querySelector('#jugador2-cartas'),
          divCartasComputadora = document.querySelector('#computadora-cartas'),
          puntosHTML = document.querySelectorAll('small');

    // Funcion crear Baraja
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    }

    const iniciaJuego = (numJugadores = 3) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasComputadora.innerHTML = '';
        divCartasJugador1.innerHTML = ''; // Limpiar cartas del jugador 1
        divCartasJugador2.innerHTML = ''; // Limpiar cartas del jugador 2

        btnPedir1.disabled = false;
        btnDetener1.disabled = false;
        btnPedir2.disabled = true;
        btnDetener2.disabled = true;

        turnoActual = 0; // Reiniciar turno al jugador 1
    }

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay más cartas';
        }
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10 :
            valor * 1;
    }

    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        if (turno === 0) {
            divCartasJugador1.appendChild(imgCarta);
        } else if (turno === 1) {
            divCartasJugador2.appendChild(imgCarta);
        } else {
            divCartasComputadora.appendChild(imgCarta);
        }
    }

    const determinaGanador = () => {
        const [puntosJugador1, puntosJugador2, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosJugador1 && puntosComputadora === puntosJugador2) {
                alert('NO HAY GANADOR');
            } else if (puntosJugador1 > 21 && puntosJugador2 > 21) {
                alert('COMPUTADORA WINS');
            } else if (puntosComputadora > 21) {
                if (puntosJugador1 <= 21 && (puntosJugador1 > puntosJugador2 || puntosJugador2 > 21)) {
                    alert('JUGADOR 1 WINS');
                } else {
                    alert('JUGADOR 2 WINS');
                }
            } else {
                if (puntosComputadora > puntosJugador1 && puntosComputadora > puntosJugador2) {
                    alert('COMPUTADORA WINS');
                } else if (puntosJugador1 > puntosComputadora && puntosJugador1 <= 21) {
                    alert('JUGADOR 1 WINS');
                } else {
                    alert('JUGADOR 2 WINS');
                }
            }
        }, 100);
    }

    // Logica IA
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, 2);
            crearCarta(carta, 2);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));
        determinaGanador();
    }

    btnPedir1.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn(`Jugador 1 Perdiste`);
            btnPedir1.disabled = true;
            btnDetener1.disabled = true;
            turnoActual = 1;
            btnPedir2.disabled = false;
            btnDetener2.disabled = false;
        } else if (puntosJugador === 21) {
            console.warn(`Jugador 1 Bien 21`);
            btnPedir1.disabled = true;
            btnDetener1.disabled = true;
            turnoActual = 1;
            btnPedir2.disabled = false;
            btnDetener2.disabled = false;
        }
    });

    btnDetener1.addEventListener('click', () => {
        btnPedir1.disabled = true;
        btnDetener1.disabled = true;
        turnoActual = 1;
        btnPedir2.disabled = false;
        btnDetener2.disabled = false;
    });

    btnPedir2.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 1);
        crearCarta(carta, 1);

        if (puntosJugador > 21) {
            console.warn(`Jugador 2 Perdiste`);
            btnPedir2.disabled = true;
            btnDetener2.disabled = true;
            turnoComputadora(Math.max(puntosJugadores[0], puntosJugadores[1]));
        } else if (puntosJugador === 21) {
            console.warn(`Jugador 2 Bien 21`);
            btnPedir2.disabled = true;
            btnDetener2.disabled = true;
            turnoComputadora(Math.max(puntosJugadores[0], puntosJugadores[1]));
        }
    });

    btnDetener2.addEventListener('click', () => {
        btnPedir2.disabled = true;
        btnDetener2.disabled = true;
        turnoComputadora(Math.max(puntosJugadores[0], puntosJugadores[1]));
    });

    btnNuevo.addEventListener('click', () => {
        iniciaJuego();
    });

    return {
        nuevoJuego: iniciaJuego
    }

})();
