$ = require "jquery"

FRAMERATE = 60
canvas_width = 500
canvas_height = 500
canvas = $("#canvas")[0]
ctx = canvas.getContext "2d"

draw = ->
	ctx.fillStyle = "#000"
	ctx.fillRect 0, 0, canvas_width, canvas_height

setInterval draw, 1000 / 60