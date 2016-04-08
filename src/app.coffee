$ = require "jquery"
Node = require "./Node.coffee"

FRAMERATE = 60
BACKGROUND_COLOR = "#FFF"
NODE_COLOR = "#0F0"
NODE_SIZE = 6

canvas_width = 500
canvas_height = 500
canvas = $("#canvas")[0]
ctx = canvas.getContext "2d"
ctx.lineWidth = 2

GRID_WIDTH = 10
GRID_HEIGHT = 10
GRID_STEP = canvas_width / GRID_WIDTH

grid = {}
# Создание точек
for i in [0..GRID_WIDTH] by 1
	grid[i] = {}
	for j in [0..GRID_HEIGHT] by 1
		grid[i][j] = new Node i * GRID_STEP, j * GRID_STEP

draw_node_line = (i1, j1, i2, j2) ->
	return if !grid[i2] || !grid[i2][j2]
	ctx.beginPath()
	ctx.moveTo grid[i1][j1].x, grid[i1][j1].y
	ctx.lineTo grid[i2][j2].x, grid[i2][j2].y
	ctx.stroke()

draw_node = (i, j) ->
	ctx.strokeStyle = "#DDD"
	draw_node_line i, j, i - 1, j
	draw_node_line i, j, i + 1, j
	draw_node_line i, j, i, j - 1
	draw_node_line i, j, i, j + 1
	x = grid[i][j].x
	y = grid[i][j].y

	#ctx.fillStyle = NODE_COLOR
	#ctx.fillRect x - NODE_SIZE / 2, y - NODE_SIZE / 2, NODE_SIZE, NODE_SIZE
	ctx.strokeStyle = NODE_COLOR
	ctx.beginPath()
	ctx.arc x, y, NODE_SIZE, 0, 2*Math.PI
	ctx.stroke()

random_interval = (min, max) ->
	return min + Math.random() * (max - min)

draw = ->
	ctx.fillStyle = BACKGROUND_COLOR
	ctx.fillRect 0, 0, canvas_width, canvas_height

	# Отрисовка точек
	for i in [0..GRID_WIDTH] by 1
		for j in [0..GRID_HEIGHT] by 1
			grid[i][j].update()
			draw_node i, j

setInterval draw, 1000 / 60

$("#run_button").click ->
	for i in [0..GRID_WIDTH] by 1
		for j in [0..GRID_HEIGHT] by 1			
			x = random_interval -0.5, 0.5
			y = random_interval -0.5, 0.5
			grid[i][j].add_velocity x, y