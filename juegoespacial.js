const game = {
    canvas: null,
    ctx: null,
    imagen: null,
    caratula: true,
    imagenEnemigo: null,
    teclaPulsada: null,
    tecla: [],
    colorBala: "red",
    balas_array: [],
    enemigos_array: [],
    x: 0,  // Coordenada X del jugador
    jugador: null,
    disparo: false,
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
function Bala(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.dibujar = function () {
        game.ctx.save();
        game.ctx.fillStyle = game.colorBala;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);
        this.y -= 4;
        game.ctx.restore();
    };
}

function Jugador(x) {
    this.x = x;
    this.y = 450;
    this.dibujar = function (x) {
        this.x = x;
        game.ctx.drawImage(game.imagen, this.x, this.y, 30, 15);
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
        // Retraso
        if (this.ciclos > 30) {
            if (this.veces > this.num) {
                this.dx *= -1;
                this.veces = 0;
                this.num = 28;
                this.y += 20;
                this.dx = (this.dx > 0) ? this.dx++ : this.dx--;
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
    game.x = game.canvas.width / 2;
    game.jugador.dibujar(game.x);
    animar();
}

const animar = () => {
    requestAnimationFrame(animar);
    verificar();
    pintar();
    colisiones();
}

const colisiones = () => {
    let enemigo, bala;

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
                i--;  // Ajusta el índice después de eliminar
                break;
            }
        }
    }
}

const verificar = () => {
    if (game.tecla[KEY_RIGHT]) game.x += 10;
    if (game.tecla[KEY_LEFT]) game.x -= 10;

    if (game.x > game.canvas.width - 30) game.x = game.canvas.width - 30;  // Evita que salga del borde derecho
    if (game.x < 0) game.x = 0;  // Evita que salga del borde izquierdo

    if (game.tecla[BARRA]) {
        game.balas_array.push(new Bala(game.x + 12, game.jugador.y - 3, 5));
        game.tecla[BARRA] = false;
    }
}

const pintar = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.jugador.dibujar(game.x);

    // Dibujar todas las balas
    for (let i = 0; i < game.balas_array.length; i++) {
        if (game.balas_array[i] != null) {
            game.balas_array[i].dibujar();
            if (game.balas_array[i].y < 0) {
                game.balas_array.splice(i, 1); // Elimina la bala si sale de la pantalla
                i--; // Ajusta el índice después de eliminar
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
    game.teclaPulsada = e.keyCode;
    game.tecla[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
    game.tecla[e.keyCode] = false;
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
        game.ctx = canvas.getContext("2d");
        if (game.ctx) {
            game.imagen = new Image();
            game.imagen.src = "nave-espacial.png";
            game.imagen.onload = function () {
                // Si necesitas hacer algo cuando la imagen del jugador se cargue, hazlo aquí
            };

            game.imagenEnemigo = new Image();
            game.imagenEnemigo.src = "invader.fw.png";
            game.imagenEnemigo.onload = function () {
                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 10; j++) {
                        game.enemigos_array.push(new Enemigo(100 + 40 * j, 30 + 45 * i));
                    }
                }
            };

            caratula();
            game.canvas.addEventListener("click", seleccionar, false);
        } else {
            alert("NO cuentas con CANVAS");
        }
    }
}
