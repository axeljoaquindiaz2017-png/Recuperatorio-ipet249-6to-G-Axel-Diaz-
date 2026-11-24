# Icy Tower: Edición Informática - IPET N° 249 "Nicolás Copérnico"

- **Institución:** IPET N° 249 "Nicolás Copérnico"
- **Especialidad:** Informática
- **Asignatura:** Laboratorio de Programación
- **Curso:** 6° G
- **Año:** 2026

---

## Descripción y Créditos
Este proyecto es una adaptación institucional y técnica del videojuego de plataformas verticales **Icy Tower**, tomando como referencia la mecánica base del repositorio original [`chavi362/Icy-Tower`](https://github.com/chavi362/Icy-Tower).

### Adaptaciones Realizadas
1. **Identidad Visual Institucional:** Se implementó la paleta oficial del IPET N° 249 (**bordó, amarillo, rojo y blanco**) en toda la interfaz (`style.css`) y dentro del lienzo de juego (`game.js`), incorporando el escudo oficial del colegio tanto en el encabezado como en marca de agua dentro del área de juego.
2. **Temática de Informática:** Las plataformas representan módulos de hardware y niveles de la especialidad, incorporando avisos curriculares al alcanzar determinados pisos (Algoritmos, JavaScript, Redes, Hardware).
3. **Modificaciones Lógicas en JavaScript (`game.js`):**
   - **Progresión dinámica ("Overclocking"):** Cada 10 pisos ascendidos, el multiplicador de velocidad de desplazamiento vertical aumenta un `0.25x` (`multiplicadorVelocidad = 1.0 + Math.floor(pisoMaximo / 10) * 0.25`).
   - **Plataformas Especiales "RAM Turbo":** Cada 5 pisos se genera una plataforma amarilla que impulsa automáticamente al personaje un 35% más alto que un salto normal.
   - **Sistema de Hitos y Bonificación:** Al llegar a los pisos 10, 20, 30, 40 y 50 se despliega un banner temático de la especialidad y se acreditan bits extra al puntaje.

---

## Instrucciones de Uso y Controles
- **Moverse a la izquierda / derecha:** Teclas `Flecha Izquierda` / `Flecha Derecha` o `A` / `D`.
- **Saltar:** Barra `Espaciadora`, `Flecha Arriba` o `W`.
- **Super Salto:** Correr horizontalmente para ganar inercia antes de presionar el salto.

---

## Enlace a la Versión Publicada (GitHub Pages)
👉 **[Jugar Icy Tower - IPET N° 249 en línea](https://tu-usuario.github.io/icy-tower-ipet249/)** *(Actualizar con tu URL pública tras activar GitHub Pages)*
