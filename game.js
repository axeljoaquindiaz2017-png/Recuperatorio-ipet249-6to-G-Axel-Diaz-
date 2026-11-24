const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Elementos del HUD y Overlays
const hudPiso = document.getElementById("hud-piso");
const hudPuntaje = document.getElementById("hud-puntaje");
const hudVelocidad = document.getElementById("hud-velocidad");
const bannerHito = document.getElementById("banner-hito");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaGameover = document.getElementById("pantalla-gameover");
const resumenFinal = document.getElementById("resumen-final");
const btnIniciar = document.getElementById("btn-iniciar");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Carga del escudo para marca de agua en el fondo del canvas
const escudoImg = new Image();
escudoImg.src = "assets/escudo_ipet249.jpg";

// Configuración física y variables de estado
const GRAVEDAD = 0.55;
const FRICCION = 0.84;
const VELOCIDAD_MOV = 0.95;
const SALTO_BASE = -12.5;

let juegoActivo = false;
let puntaje = 0;
let pisoMaximo = 0;
let velocidadScrollBase = 1.1;
let multiplicadorVelocidad = 1.0;
let ultimoHitoMostrado = 0;
let timeoutBanner = null;

// Hitos temáticos de Informática - IPET N° 249
const HITOS_INFORMATICA = {
    10: "PISO 10: ¡Dominaste Lógica y Algoritmos! (+100 bits)",
    20: "PISO 20: ¡Compilación Exitosa en JS! (+200 bits)",
    30: "PISO 30: ¡Laboratorio de Redes Conectado! (+300 bits)",
    40: "PISO 40: ¡Arquitectura de Hardware Superada! (+400 bits)",
    50: "PISO 50: ¡Técnico en Informática IPET 249! (+500 bits)"
};

// Objeto Jugador (Avatar Técnico del Taller)
const jugador = {
    x: 220,
    y: 500,
    ancho: 30,
    alto: 38,
    vx: 0,
    vy: 0,
    enSuelo: false
};

let plataformas = [];
const teclas = {};

// Escucha de teclado
window.addEventListener("keydown", (e) => {
    teclas[e.code] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }
});

window.addEventListener("keyup", (e) => {
    teclas[e.code] = false;
});

function mostrarBannerHito(texto) {
    bannerHito.textContent = texto;
    bannerHito.classList.remove("oculto");
    clearTimeout(timeoutBanner);
    timeoutBanner = setTimeout(() => {
        bannerHito.classList.add("oculto");
    }, 3000);
}

function crearPlataformasIniciales() {
    plataformas = [];
    // Plataforma base (Piso 0)
    plataformas.push({
        x: 0,
        y: 560,
        ancho: canvas.width,
        alto: 22,
        numeroPiso: 0,
        esTurbo: false
    });

    // Generar las primeras 12 plataformas
    for (let i = 1; i <= 12; i++) {
        generarPlataforma(i, 560 - i * 85);
    }
}

function generarPlataforma(numeroPiso, posY) {
    const ancho = numeroPiso % 10 === 0 ? canvas.width - 40 : Math.floor(Math.random() * 95) + 95;
    const x = numeroPiso % 10 === 0 ? 20 : Math.floor(Math.random() * (canvas.width - ancho));
    const esTurbo = numeroPiso > 0 && numeroPiso % 5 === 0 && numeroPiso % 10 !== 0;

    plataformas.push({
        x: x,
        y: posY,
        ancho: ancho,
        alto: 16,
        numeroPiso: numeroPiso,
        esTurbo: esTurbo
    });
}

function iniciarJuego() {
    puntaje = 0;
    pisoMaximo = 0;
    multiplicadorVelocidad = 1.0;
    ultimoHitoMostrado = 0;

    jugador.x = canvas.width / 2 - jugador.ancho / 2;
    jugador.y = 510;
    jugador.vx = 0;
    jugador.vy = 0;
    jugador.enSuelo = true;

    crearPlataformasIniciales();
    actualizarHUD();

    pantallaInicio.classList.add("oculto");
    pantallaGameover.classList.add("oculto");
    bannerHito.classList.add("oculto");
    juegoActivo = true;
    requestAnimationFrame(buclePrincipal);
}

function actualizarHUD() {
    hudPiso.textContent = pisoMaximo;
    hudPuntaje.textContent = puntaje;
    hudVelocidad.textContent = multiplicadorVelocidad.toFixed(1) + "x";
}

function verificarHitosYProgresion(pisoActual) {
    if (pisoActual > pisoMaximo) {
        const pisosSubidos = pisoActual - pisoMaximo;
        pisoMaximo = pisoActual;
        puntaje += pisosSubidos * 10;

        // Modificación Lógica 1: Aumento de velocidad cada 10 pisos
        multiplicadorVelocidad = 1.0 + Math.floor(pisoMaximo / 10) * 0.25;

        // Modificación Lógica 2: Hitos curriculares de Informática
        if (HITOS_INFORMATICA[pisoMaximo] && ultimoHitoMostrado !== pisoMaximo) {
            ultimoHitoMostrado = pisoMaximo;
            puntaje += pisoMaximo * 10;
            mostrarBannerHito(HITOS_INFORMATICA[pisoMaximo]);
        }
        actualizarHUD();
    }
}

function actualizarLogica() {
    // Movimiento horizontal
    if (teclas["ArrowLeft"] || teclas["KeyA"]) {
        jugador.vx -= VELOCIDAD_MOV;
    }
    if (teclas["ArrowRight"] || teclas["KeyD"]) {
        jugador.vx += VELOCIDAD_MOV;
    }

    jugador.vx *= FRICCION;
    jugador.x += jugador.vx;

    // Rebote en paredes laterales del taller
    if (jugador.x < 0) {
        jugador.x = 0;
        jugador.vx *= -0.6;
    } else if (jugador.x + jugador.ancho > canvas.width) {
        jugador.x = canvas.width - jugador.ancho;
        jugador.vx *= -0.6;
    }

    // Salto (incluye impulso extra estilo Icy Tower si lleva velocidad horizontal)
    if ((teclas["Space"] || teclas["ArrowUp"] || teclas["KeyW"]) && jugador.enSuelo) {
        const impulsoExtra = Math.abs(jugador.vx) > 4.2 ? -3.8 : 0;
        jugador.vy = SALTO_BASE + impulsoExtra;
        jugador.enSuelo = false;
    }

    // Aplicar gravedad
    jugador.vy += GRAVEDAD;
    jugador.y += jugador.vy;
    jugador.enSuelo = false;

    // Detección de colisiones con plataformas (solo al caer)
    if (jugador.vy >= 0) {
        for (const plat of plataformas) {
            const dentroEnX = jugador.x + jugador.ancho > plat.x + 5 && jugador.x < plat.x + plat.ancho - 5;
            const cruzaEnY = jugador.y + jugador.alto >= plat.y && jugador.y + jugador.alto - jugador.vy <= plat.y + plat.alto;

            if (dentroEnX && cruzaEnY) {
                jugador.y = plat.y - jugador.alto;
                jugador.vy = 0;
                jugador.enSuelo = true;

                // Modificación Lógica 3: Plataforma Turbo RAM (impulso automático)
                if (plat.esTurbo) {
                    jugador.vy = SALTO_BASE * 1.35;
                    jugador.enSuelo = false;
                }

                verificarHitosYProgresion(plat.numeroPiso);
                break;
            }
        }
    }

    // Desplazamiento vertical de cámara (subida automática + seguimiento al jugador)
    let desplazamientoY = 0;
    if (pisoMaximo >= 1) {
        desplazamientoY = velocidadScrollBase * multiplicadorVelocidad;
    }
    if (jugador.y < 220) {
        desplazamientoY += (220 - jugador.y) * 0.15;
    }

    if (desplazamientoY > 0) {
        jugador.y += desplazamientoY;
        for (const plat of plataformas) {
            plat.y += desplazamientoY;
        }
    }

    // Reciclar plataformas inferiores y generar nuevas arriba
    plataformas = plataformas.filter((p) => p.y < canvas.height + 40);
    while (plataformas.length < 13) {
        const ultimaPlat = plataformas[plataformas.length - 1];
        generarPlataforma(ultimaPlat.numeroPiso + 1, ultimaPlat.y - 85);
    }

    // Condición de derrota (caer fuera del borde inferior)
    if (jugador.y > canvas.height) {
        juegoActivo = false;
        resumenFinal.textContent = `Alcanzaste el Piso ${pisoMaximo} con ${puntaje} bits acumulados.`;
        pantallaGameover.classList.remove("oculto");
    }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grilla sutil estilo circuito impreso (PCB) en el fondo
    ctx.strokeStyle = "rgba(244, 196, 48, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Marca de agua institucional (Escudo IPET 249 en el centro del canvas)
    if (escudoImg.complete && escudoImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.14;
        ctx.drawImage(escudoImg, canvas.width / 2 - 90, canvas.height / 2 - 90, 180, 180);
        ctx.restore();
    }

    // Dibujar plataformas con temática de hardware/código
    for (const plat of plataformas) {
        if (plat.esTurbo) {
            ctx.fillStyle = "#F4C430"; // Amarillo RAM Turbo
            ctx.strokeStyle = "#FFFFFF";
        } else if (plat.numeroPiso % 10 === 0) {
            ctx.fillStyle = "#D92B2B"; // Rojo Hito Institucional
            ctx.strokeStyle = "#F4C430";
        } else {
            ctx.fillStyle = "#8C1624"; // Bordó estándar
            ctx.strokeStyle = "#F4C430";
        }

        ctx.lineWidth = 2;
        ctx.fillRect(plat.x, plat.y, plat.ancho, plat.alto);
        ctx.strokeRect(plat.x, plat.y, plat.ancho, plat.alto);

        // Etiqueta de número de piso o tipo de placa
        ctx.fillStyle = plat.esTurbo ? "#4A0A12" : "#FFFFFF";
        ctx.font = "bold 10px monospace";
        const etiqueta = plat.esTurbo ? `RAM #${plat.numeroPiso}` : `PISO ${plat.numeroPiso}`;
        ctx.fillText(etiqueta, plat.x + 8, plat.y + 12);
    }

    // Dibujar avatar del estudiante de Informática (paleta institucional)
    // Cuerpo (guardapolvo/buzo bordó con detalles amarillos)
    ctx.fillStyle = "#6B0F1A";
    ctx.fillRect(jugador.x, jugador.y + 12, jugador.ancho, jugador.alto - 12);
    ctx.strokeStyle = "#F4C430";
    ctx.lineWidth = 2;
    ctx.strokeRect(jugador.x, jugador.y + 12, jugador.ancho, jugador.alto - 12);

    // Cabeza y visor tecnológico
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(jugador.x + 4, jugador.y, jugador.ancho - 8, 13);
    ctx.fillStyle = "#D92B2B";
    ctx.fillRect(jugador.x + 7, jugador.y + 4, jugador.ancho - 14, 4);
}

function buclePrincipal() {
    if (!juegoActivo) return;
    actualizarLogica();
    dibujar();
    requestAnimationFrame(buclePrincipal);
}

btnIniciar.addEventListener("click", iniciarJuego);
btnReiniciar.addEventListener("click", iniciarJuego);
