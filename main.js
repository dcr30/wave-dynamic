const FRAMERATE = 100;
const BACKGROUND_COLOR = "#FFF";
// Узел
const NODE_STEP = 50; 			// Расстояние между узлами
const NODE_COLOR = "#0F0";		// Цвет узла
const NODE_SIZE = 6;			// Размер узла
const NODE_LINE_WIDTH = 1;		// Ширина линии, соединяющей узлы
const NODE_LINE_COLOR = "#DDD";	// Цвет линии, соединяющей узлы
// Размеры canvas'а
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

var isRunning = false;

// Класс для узла сетки
var Node = function (x, y) {
	this.x = x;
	this.y = y;

	this.vx = 0;
	this.vy = 0;

	
	this.t = 0;

	this.draw = function (ctx, fX, fY, aX, aY) {
		// Движение 
		if (isRunning) {
			this.x = x + Math.sin(performance.now() * fX + x * 2) * aX;
			this.y = y + Math.cos(performance.now() * fX + x * 2) * aY;
		}

		var distance = Math.min(1, Math.abs(this.x - x) / NODE_STEP * 2);
		var r = Math.round(255 - 255 * distance);
		var g = Math.round(255 * distance);
		ctx.strokeStyle = "rgb(255, " + r +", " + g + ")";//NODE_COLOR;
		ctx.fillStyle = ctx.strokeStyle;
		ctx.beginPath();
		ctx.arc(this.x, this.y, NODE_SIZE, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

// Класс сетки
var Grid = function (width, height) {
	this.width = width;
	this.height = height;

	this.fX = 0.002;
	this.fY = 0.01;
	this.aX = 20;
	this.aY = 20;

	var grid = new Array(width);
	for (var i = 0; i < width; i++) {
		grid[i] = new Array(height);
		for (var j = 0; j < height; j++) {
			grid[i][j] = new Node(i * NODE_STEP + NODE_STEP / 2, j * NODE_STEP + NODE_STEP / 2);
		}
	}

	// Отрисовка линии между узлами
	var drawLineBetweenNodes = function (ctx, i1, j1, i2, j2) {
		if (!grid[i1] || !grid[i1][j1] || !grid[i2] || !grid[i2][j2]) {
			return;
		}
		var node1 = grid[i1][j1];
		var node2 = grid[i2][j2];
		ctx.strokeStyle = NODE_LINE_COLOR;
		ctx.beginPath();
		ctx.moveTo(node1.x, node1.y);
		ctx.lineTo(node2.x, node2.y);
		ctx.stroke();
	}

	this.draw = function(ctx) {
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				drawLineBetweenNodes(ctx, i, j, i + 1, j);
				drawLineBetweenNodes(ctx, i, j, i - 1, j);
				drawLineBetweenNodes(ctx, i, j, i, j + 1);
				drawLineBetweenNodes(ctx, i, j, i, j - 1);

				grid[i][j].draw(ctx, this.fX, this.fY, this.aX, this.aY);
			}
		}
	}
}

function init() {
	var canvas = $("canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = NODE_LINE_WIDTH;

	var gridWidth = Math.round(CANVAS_WIDTH / NODE_STEP);
	var gridHeight = Math.round(CANVAS_HEIGHT / NODE_STEP);
	var grid = new Grid(gridWidth, gridHeight);

	var draw = function () {
		// Очистка 
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Отрисовка сетки
		grid.draw(ctx);		
	}
	setInterval(draw, FRAMERATE / 1000);

	$("#start_button").click(function () {
		$(this).text(function(i, text) {
			isRunning = text === "Запустить";			
			return isRunning ? "Остановить" : "Запустить";
		});
	});
	isRunning = true;

	$("#fx").change(function () {
		var val = $(this).val();
		grid.fX = Number(val);
	});

	$("#ax").change(function () {
		var val = $(this).val();
		grid.aX = Number(val);
	});
	$("#ay").change(function () {
		var val = $(this).val();
		grid.aY = Number(val);
	});		
}