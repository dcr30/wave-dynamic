const FRAMERATE = 100;
const BACKGROUND_COLOR = "#FBFBFB";
// Узел
const NODE_STEP = 50; 			// Расстояние между узлами
const NODE_COLOR = "#0F0";		// Цвет узла
const NODE_SIZE = 6;			// Размер узла
const NODE_LINE_WIDTH = 1;		// Ширина линии, соединяющей узлы
const NODE_LINE_COLOR = "#DDD";	// Цвет линии, соединяющей узлы
// Размеры canvas'а
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

var waveParams = {
	frequency: 1,
	amplitude: 30,
	transverse: true
}

var isRunning = false;

Math.clamp = function(a,b,c) {
	return Math.max(b,Math.min(c,a));
}

// Функция смещения для плоской волны
function xi(x, time, amplitude, frequency) {
	return amplitude * Math.cos(frequency * (time - x / frequency)) * Math.exp(-(time) * 0.1);
}

// Класс для узла сетки
var Node = function (x, y) {
	this.x = x;
	this.y = y;

	this.vx = 0;
	this.vy = 0;

	this.t = -x / NODE_STEP;
	this.color = {
		r: 255,
		g: 0,
		b: 0,
	}	

	this.setColor = function(r, g, b) {
		this.color = {
			r: Math.clamp(Math.round(r), 0, 255),
			g: Math.clamp(Math.round(g), 0, 255),
			b: Math.clamp(Math.round(b), 0, 255),
		}
	}
	this.draw = function (ctx, deltaTime) {
		if (isRunning) {
			this.t += deltaTime;
		}
		// if (this.x > 70) {
		// 	return;
		// }
		ctx.strokeStyle = "rgb(" + this.color.r + ", " + this.color.g +", " + this.color.b + ")";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.beginPath();
		ctx.arc(this.x, this.y, NODE_SIZE, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		var tmul = 1;
		if (this.t < 0) {
			var tmul = 1 - (-this.t) / 1;
		}
		this.setColor(0, 150 * tmul, 255);		
		if (this.t < 0) {
			return;
		}
		// Смещение
		var offset = -xi(Math.PI, this.t, waveParams.amplitude, waveParams.frequency)-waveParams.amplitude;
		if (waveParams.transverse) {
			this.y = y + offset;
		} else {
			this.x = x + offset;			
		}

		// Цвет в зависимости от смещения
		//console.log(this.t)
		// if () {
		// 	this.setColor(255, 0, 0);
		// } else {
		// 	this.setColor(0, 0, 255);
		// }//NODE_COLOR;
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
			grid[i][j] = new Node(i * NODE_STEP + NODE_STEP / 2, j * NODE_STEP + NODE_STEP / 2 + NODE_STEP);
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

	this.draw = function(ctx, deltaTime) {
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				drawLineBetweenNodes(ctx, i, j, i + 1, j);
				drawLineBetweenNodes(ctx, i, j, i - 1, j);
				drawLineBetweenNodes(ctx, i, j, i, j + 1);
				drawLineBetweenNodes(ctx, i, j, i, j - 1);

				grid[i][j].draw(ctx, deltaTime);
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

	var lastNow;
	var draw = function (now) {
		requestAnimationFrame(draw);

		// deltaTime
		var deltaTime = 0;
		if (lastNow) {
			deltaTime = (now - lastNow) / 1000;
		}
		lastNow = now;

		// Очистка 
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Отрисовка сетки
		grid.draw(ctx, deltaTime);		
	}
	requestAnimationFrame(draw);
	//setInterval(draw, FRAMERATE / 1000);

	$("#start_button").click(function () {
		$(this).text(function(i, text) {
			$(this).toggleClass("btn-danger");
			isRunning = text === "Запустить";			
			return isRunning ? "Остановить" : "Запустить";
		});
	});

	$("#wave_frequency").change(function () {
		var val = $(this).val();
		waveParams.frequency = Number(val);
	});

	$("#wave_amplitude").change(function () {
		var val = $(this).val();
		waveParams.amplitude = Number(val);
	})

	$("#wave_frequency").val(waveParams.frequency);
	$("#wave_amplitude").val(waveParams.amplitude);
}