class Node
	constructor: (x, y) ->
		@x = x
		@y = y

		# Скорость
		@velocity_x = 0
		@velocity_y = 0

		# Трение
		@friction = 0.96

	update: ->
		@x += @velocity_x
		@y += @velocity_y

		@velocity_x *= @friction
		@velocity_y *= @friction

	add_velocity: (x = 0, y = 0) ->
		@velocity_x += x
		@velocity_y += y

module.exports = Node