
const blackjack = (() => {
    'use strict';

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];
    let puntos = [0, 0, 0]; // puntos[0] para jugador 1, puntos[1] para jugador 2, puntos[2] para jugador 3

    // Referencias HTML
    const btnPedir = document.querySelector('#btnPedir');
    const btnDetener = document.querySelector('#btnDetener');
    const btnNuevo = document.querySelector('#btnNuevo');
    const divCartasJugadores = document.querySelectorAll('.cartas-jugador');
    const puntosHTML = document.querySelectorAll('.puntos-jugador');

    
    const crearDeck = () =>{
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
        deck=_.shuffle(deck);
        return deck;
    }

    function iniciaJuego() {
        crearDeck();
        puntosHTML.forEach(punto => punto.innerText = 0);
        divCartasJugadores.forEach(div => div.innerHTML = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    function pedirCarta() {
        if (deck.length === 0) {
            throw 'No hay más cartas';
        }
        return deck.pop();
    }

    function acumularPuntos(carta, turno) {
        puntos[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntos[turno];
        return puntos[turno];
    }

    function valorCarta(carta) {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10 :
            valor * 1;
    }

    function turnoComputadora(puntosMinimos, jugador) {
        // Lógica del turno de la computadora para un jugador específico
        do {
            const carta = pedirCarta();
            puntos[jugador] = acumularPuntos(carta, jugador);

            const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${carta}.png`;
            imgCarta.classList.add('carta');
            divCartasJugadores[jugador].appendChild(imgCarta);

            if (puntosMinimos > 21) {
                break;
            }

        } while ((puntos[jugador] < puntosMinimos) && (puntosMinimos <= 21));

        determinaGanador();
    }

    function crearCarta(carta, turno) {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].appendChild(imgCarta);
    }

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        acumularPuntos(carta, 0); // Jugador 1
        crearCarta(carta, 0);
        if (puntos[0] > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntos[0], 1); // Turno de la computadora (jugador 2)
        } else if (puntos[0] === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntos[0], 1); // Turno de la computadora (jugador 2)
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntos[0], 1); // Turno de la computadora (jugador 2)
    });

    btnNuevo.addEventListener('click', iniciaJuego);

    // Función que determina el ganador
    function determinaGanador() {
        setTimeout(() => {
            // Implementa la lógica para determinar quién gana
            let maxPuntos = -1;
            let ganador = -1;
            for (let i = 0; i < puntos.length; i++) {
                if (puntos[i] <= 21 && puntos[i] > maxPuntos) {
                    maxPuntos = puntos[i];
                    ganador = i;
                }
            }
            if (ganador !== -1) {
                alert(`¡Jugador ${ganador + 1} gana!`);
            } else {
                alert('No hay ganador, todos perdieron.');
            }
        }, 10);
    }

    // Retorno del objeto público
    return {
        iniciaJuego,
        pedirCarta,
        turnoComputadora,
        crearCarta,
        acumularPuntos
    };

})(); // Cierre de la función auto invocada

// Llamada a la función iniciaJuego al inicio del juego
blackjack.iniciaJuego();


