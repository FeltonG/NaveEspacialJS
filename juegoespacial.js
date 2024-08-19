const game = {
    canvas: null,
    ctx: null,
    imagen: null,
    caratula: true,
    imagenEnemigo: null,
    teclaPulsada: null,
    tecla: [],
    colorBala: "red",
    colorBala2: "white",
    balas_array: [],
    balaEnemigas_array: [],
    enemigos_array: [],
    x: 0,  // Coordenada X del jugador
    jugador: null,
    disparo: false,
    puntos: 0,
    finJuego: false,
    victoria: false,  // Nuevo estado para verificar si se ha ganado
}

/*******************
CONSTANTES
********************/
const KEY_ENTER = 13;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const BARRA = 32;

/*****************
OBJETOS
******************/
function Bala(x, y, w, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.color = color;
    this.dibujar = function () {
        game.ctx.save();
        game.ctx.fillStyle = this.color;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);
        this.y -= 4;
        game.ctx.restore();
    };

    this.disparar = function () {
        game.ctx.save();
        game.ctx.fillStyle = this.color;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);
        this.y += 4;
        game.ctx.restore();
    }
}

function Jugador(x) {
    this.x = x;
    this.y = 450;
    this.w = 30;
    this.h = 15;
    this.dibujar = function () {
        game.ctx.drawImage(game.imagen, this.x, this.y, this.w, this.h);
    };
}

function Enemigo(x, y) {
    this.x = x;
    this.y = y;
    this.w = 35;
    this.veces = 0;
    this.dx = 5;
    this.ciclos = 0;
    this.num = 14;
    this.figura = true;
    this.vive = true;
    this.dibujar = function () {
        if (this.ciclos > 30) {
            if (this.veces > this.num) {
                this.dx *= -1;
                this.veces = 0;
                this.num = 28;
                this.y += 20;
                this.dx = (this.dx > 0) ? this.dx + 1 : this.dx - 1;
            } else {
                this.x += this.dx;
            }
            this.veces++;
            this.ciclos = 0;
            this.figura = !this.figura;
        } else {
            this.ciclos++;
        }

        if (this.figura) {
            game.ctx.drawImage(game.imagenEnemigo, 0, 0, 40, 30, this.x, this.y, 35, 30);
        } else {
            game.ctx.drawImage(game.imagenEnemigo, 50, 0, 35, 30, this.x, this.y, 35, 30);
        }
    };
}

/***********
FUNCIONES
************/
const caratula = () => {
    let imagen = new Image();
    imagen.src = "jiji.jpg";
    imagen.onload = () => {
        game.ctx.drawImage(imagen, 0, 0);
    }
}

const seleccionar = (e) => {
    if (game.caratula) {
        inicio();
    }
}

const inicio = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.caratula = false;
    game.jugador = new Jugador(game.canvas.width / 2);  // Centra el jugador al inicio
    animar();
}

const animar = () => {
    if (!game.finJuego) {
        requestAnimationFrame(animar);
        verificar();
        pintar();
        colisiones();
    } else {
        if (game.victoria) {
            mostrarMensaje("¡Ganaste!", 100, 60);
            mostrarMensaje("Lograste " + game.puntos + " puntos", 220);
        } else {
            gameOver();
        }
    }
}

const colisiones = () => {
    let enemigo, bala, balaEnemiga;

    // Colisiones con las balas del jugador
    for (let i = 0; i < game.enemigos_array.length; i++) {
        enemigo = game.enemigos_array[i];
        for (let j = 0; j < game.balas_array.length; j++) {
            bala = game.balas_array[j];

            if (
                bala.x > enemigo.x &&
                bala.x < enemigo.x + enemigo.w &&
                bala.y > enemigo.y &&
                bala.y < enemigo.y + enemigo.w
            ) {
                enemigo.vive = false;
                game.enemigos_array.splice(i, 1);  // Elimina el enemigo
                game.balas_array.splice(j, 1);     // Elimina la bala
                game.disparo = false;
                game.puntos += 10;
                break;
            }
        }
    }

    // Colisiones con las balas de los enemigos
    for (let i = 0; i < game.balaEnemigas_array.length; i++) {
        balaEnemiga = game.balaEnemigas_array[i];

        if (
            balaEnemiga.x > game.jugador.x &&
            balaEnemiga.x < game.jugador.x + 30 &&
            balaEnemiga.y > game.jugador.y &&
            balaEnemiga.y < game.jugador.y + 15
        ) {
            // Aquí puedes manejar lo que sucede cuando una bala enemiga golpea al jugador
            console.log("¡El jugador fue golpeado!");
            game.balaEnemigas_array.splice(i, 1);  // Elimina la bala enemiga
            game.finJuego = true;
            return; // Termina la función después de detectar una colisión
        }
    }

    // Verificar si todos los enemigos han sido eliminados para declarar victoria
    if (game.enemigos_array.length === 0) {
        game.finJuego = true;
        game.victoria = true;
    }
}

const gameOver = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.balas_array = [];
    game.enemigos_array = [];
    game.balaEnemigas_array = [];
    game.finJuego = true;
    mostrarMensaje("GAME OVER", 100, 60);
    mostrarMensaje("Lograste " + game.puntos + " puntos", 220);
    
    if (game.puntos > 100 && game.puntos <= 200) {
        mostrarMensaje("Casi lo logras", 340);
    } else if (game.puntos > 200) {
        mostrarMensaje("Felicitaciones", 340);
    } else {
        mostrarMensaje("Lo siento", 340);
    }
}

const mostrarMensaje = (cadena, y, tamano = 40) => {
    let medio = (game.canvas.width) / 2;
    game.ctx.save();
    game.ctx.fillStyle = "green";
    game.ctx.strokeStyle = "blue";
    game.ctx.font = "bold " + tamano + "px Courier";
    game.ctx.textAlign = "center";
    game.ctx.fillText(cadena, medio, y);
    game.ctx.restore();
}

const score = () => {
    game.ctx.save();
    game.ctx.fillStyle = "white";
    game.ctx.font = "bold 20px Courier";
    game.ctx.fillText("SCORE: " + game.puntos, 10, 20);
    game.ctx.restore();
}

const verificar = () => {
    if (game.finJuego) {
        if (game.tecla[BARRA]) {
            reiniciarJuego();
            game.tecla[BARRA] = false; // Evita reiniciar múltiples veces con una sola pulsación
        }
        return; // Salir de la función si el juego ha terminado
    }

    // Movimiento del jugador
    if (game.tecla[KEY_RIGHT]) game.jugador.x += 10;
    if (game.tecla[KEY_LEFT]) game.jugador.x -= 10;

    if (game.jugador.x > game.canvas.width - 30) game.jugador.x = game.canvas.width - 30;  // Evita que salga del borde derecho
    if (game.jugador.x < 0) game.jugador.x = 0;  // Evita que salga del borde izquierdo

    // Disparo del jugador
    if (game.tecla[BARRA]) {
        if (!game.disparo) {
            game.balas_array.push(new Bala(game.jugador.x + 12, game.jugador.y - 3, 5, game.colorBala));
            game.tecla[BARRA] = false;
            game.disparo = true;
        }
    }

    // Disparo enemigo
    if (Math.random() > 0.96) {
        dispararEnemigo();
    }
}
const reiniciarJuego = () => {
    game.puntos = 0;
    game.finJuego = false;
    game.jugador = new Jugador(game.canvas.width / 2);  // Reposicionar el jugador al centro
    game.enemigos_array = [];
    game.balas_array = [];
    game.balaEnemigas_array = [];
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            game.enemigos_array.push(new Enemigo(100 + 40 * j, 30 + 45 * i));
        }
    }
    
    animar(); // Reiniciar el loop de animación
}


const dispararEnemigo = () => {
    const ultimos = [];

    for (let i = game.enemigos_array.length - 1; i >= 0; i--) {
        if (game.enemigos_array[i] != null) {
            ultimos.push(i);
        }
        if (ultimos.length == 10) break;
    }

    const d = ultimos[Math.floor(Math.random() * ultimos.length)];
    game.balaEnemigas_array.push(new Bala(game.enemigos_array[d].x + game.enemigos_array[d].w / 2, game.enemigos_array[d].y + game.enemigos_array[d].w, 5, game.colorBala2));
}

const pintar = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    score();
    game.jugador.dibujar();  // Dibuja el jugador con su posición actual

    // Dibujar todas las balas del jugador
    for (let i = 0; i < game.balas_array.length; i++) {
        if (game.balas_array[i] != null) {
            game.balas_array[i].dibujar();
            if (game.balas_array[i].y < 0) {
                game.disparo = false;
                game.balas_array.splice(i, 1);  // Eliminar bala fuera de pantalla
                i--;  // Ajustar el índice después de eliminar
            }
        }
    }

    // Dibujar todas las balas enemigas
    for (let i = 0; i < game.balaEnemigas_array.length; i++) {
        if (game.balaEnemigas_array[i] != null) {
            game.balaEnemigas_array[i].disparar();
            if (game.balaEnemigas_array[i].y > game.canvas.height) {
                game.balaEnemigas_array.splice(i, 1);  // Eliminar bala enemiga fuera de pantalla
                i--;  // Ajustar el índice después de eliminar
            }
        }
    }

    // Dibujar todos los enemigos
    for (let i = 0; i < game.enemigos_array.length; i++) {
        if (game.enemigos_array[i] != null) {
            game.enemigos_array[i].dibujar();
        }
    }
}

/*************
LISTENER
**************/
document.addEventListener("keydown", function (e) {
    game.tecla[e.keyCode] = true;
    console.log("Tecla presionada:", e.keyCode);
});

document.addEventListener("keyup", function (e) {
    game.tecla[e.keyCode] = false;
    console.log("Tecla liberada:", e.keyCode);
});

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 17); }
})();

window.onload = function () {
    game.canvas = document.getElementById("canvas");
    if (game.canvas && game.canvas.getContext) {
        game.ctx = game.canvas.getContext("2d");
        if (game.ctx) {
            game.imagen = new Image();
            game.imagen.src = "nave-espacial.png";
            game.imagen.onload = function () {
                // La imagen del jugador se cargó correctamente
            };

            game.imagenEnemigo = new Image();
            game.imagenEnemigo.src = "invader.fw.png";
            game.imagenEnemigo.onload = function () {
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 10; j++) {
                        game.enemigos_array.push(new Enemigo(100 + 40 * j, 30 + 45 * i));
                    }
                }
            };

            caratula();
            game.canvas.addEventListener("click", seleccionar, false);
        } else {
            alert("No tienes soporte para Canvas.");
        }
    }
}
