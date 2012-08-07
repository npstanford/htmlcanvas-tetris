/*
 * tetris
 * NPStanford
 *
 */

$(document).ready(function() {
	//aquire context and all that
	var tetrisCan = $('#tetris');
	var ctx = tetrisCan[0].getContext('2d');

	//constants
	BLOCK_SIZE = 20;
	BLOCK_GAP = 2;
	WELL_THICKNESS = 5;
	WELL_LEFT = 25 - WELL_THICKNESS;
	WELL_TOP = 25 - WELL_THICKNESS;
	WELL_WIDTH = 10;
	// in horizontal units
	WELL_DEPTH = WELL_WIDTH * 1.7;
	// in vertical units
	WELL_RIGHT = WELL_LEFT + WELL_WIDTH * BLOCK_SIZE + WELL_THICKNESS;
	WELL_BOTTOM = WELL_TOP + WELL_DEPTH * BLOCK_SIZE + WELL_THICKNESS;
	BACKGROUND_COLOR = 'white';
	BLOCK_BORDER_COLOR = 'black';
	WELL_BORDER_COLOR = 'black';
	DEFAULT_SPEED = 400;
	DOWN_SPEED = 50;
	
	//score board
	PREV_TOP = WELL_TOP + 1 * BLOCK_SIZE;
	PREV_LEFT = WELL_LEFT + (WELL_WIDTH + 2) * BLOCK_SIZE;
	PREV_WIDTH = 6;
	PREV_DEPTH = 4;
	SCORE_TOP = (PREV_TOP) + PREV_DEPTH * BLOCK_SIZE;
	SCORE_LEFT = PREV_LEFT
	SCORE_WIDTH = PREV_WIDTH;
	SCORE_DEPTH = 2;
	

	//gameplay variables
	var actBlock;
	var well;
	var paused;
	var score;
	var speed;
	var nextBlock;
	// if true, pause the game in the loop

	function init() {
		score = 0;
		clearScreen();
		speed = DEFAULT_SPEED;
		well = new gameWell();
		actBlock = newActBlock();
		actBlock.draw();
		nextBlock.draw();
	}

	//where are all of the fun happens
	function gameLoop() {
		if (!paused) {
			actBlock.fall();
			clearScreen();
			well.drawGrid();
			actBlock.draw();
			nextBlock.draw();
			scoreOut();
		}
		setTimeout(gameLoop, speed);
	}

	function Tetrom(shape) {
		//so each block has a corner stone, which is the first element of the aray
		// each individual orientation is hardcoded in.
		this.shape = shape;
		this.rot = 0;
		// 0 through 3
		this.blocks = []
		this.blocks[0] = {x: 14, y: 2};
		this.active = false;

		//set a color for the blocks
		this.color = this.shape == 'I' ? 'aqua' : this.shape == 'J' ? 'blue' : this.shape == 'L' ? 'orange' : this.shape == 'O' ? 'yellow' : this.shape == 'S' ? 'lime' : this.shape == 'T' ? 'purple' : this.shape == 'Z' ? 'red' : 'black';

		this.orient = function(x1, y1, x2, y2, x3, y3) {
			var tempBlocks = this.createTemp();
			tempBlocks[1] = {
				x : x1,
				y : y1
			};
			tempBlocks[2] = {
				x : x2,
				y : y2
			};
			tempBlocks[3] = {
				x : x3,
				y : y3
			};
			if (this.checkCollision(tempBlocks)) {
				return;
			}
			this.blocks = tempBlocks;
		}
		//handles rotating a block
		this.rotate = function(redraw) {
			if (redraw == undefined){
				this.rot = (this.rot + 1) % 4;
			}
			var rot = this.rot;

			cx = this.blocks[0].x;
			cy = this.blocks[0].y;
			if (this.shape == 'I') {
				if (rot == 0 || rot == 2)
					this.orient(cx - 1, cy, cx + 1, cy, cx + 2, cy);
				if (rot == 1 || rot == 3)
					this.orient(cx, cy - 1, cx, cy + 1, cx, cy + 2);
			}
			if (this.shape == 'J') {
				if (rot == 0)
					this.orient(cx - 1, cy, cx + 1, cy, cx + 1, cy + 1);
				if (rot == 1)
					this.orient(cx, cy - 1, cx, cy + 1, cx - 1, cy + 1);
				if (rot == 2)
					this.orient(cx - 1, cy - 1, cx - 1, cy, cx + 1, cy);
				if (rot == 3)
					this.orient(cx, cy - 1, cx + 1, cy - 1, cx, cy + 1);
			}
			if (this.shape == 'L') {
				if (rot == 0)
					this.orient(cx - 1, cy, cx - 1, cy + 1, cx + 1, cy);
				if (rot == 1)
					this.orient(cx - 1, cy - 1, cx, cy - 1, cx, cy + 1);
				if (rot == 2)
					this.orient(cx - 1, cy, cx + 1, cy, cx + 1, cy - 1);
				if (rot == 3)
					this.orient(cx, cy - 1, cx, cy + 1, cx + 1, cy + 1);
			}
			if (this.shape == 'O')
				this.orient(cx + 1, cy, cx, cy + 1, cx + 1, cy + 1);
			if (this.shape == 'S') {
				if (rot == 0 || rot == 2)
					this.orient(cx - 1, cy + 1, cx, cy + 1, cx + 1, cy);
				if (rot == 1 || rot == 3)
					this.orient(cx - 1, cy - 1, cx - 1, cy, cx, cy + 1);
			}
			if (this.shape == 'T') {
				if (rot == 0)
					this.orient(cx - 1, cy, cx, cy + 1, cx + 1, cy);
				if (rot == 1)
					this.orient(cx - 1, cy, cx, cy - 1, cx, cy + 1);
				if (rot == 2)
					this.orient(cx - 1, cy, cx, cy - 1, cx + 1, cy);
				if (rot == 3)
					this.orient(cx + 1, cy, cx, cy - 1, cx, cy + 1);
			}
			if (this.shape == 'Z') {
				if (rot == 0 || rot == 2)
					this.orient(cx - 1, cy, cx, cy + 1, cx + 1, cy + 1);
				if (rot == 1 || rot == 3)
					this.orient(cx, cy - 1, cx - 1, cy, cx - 1, cy + 1);
			}
			this.statusOut();
		}

		this.draw = function() {
			for (var i = 0; i < this.blocks.length; i++) {
				drawSquare(this.blocks[i].x, this.blocks[i].y, this.color);
			};
		}

		this.statusOut = function() {
			console.log('active shape: ' + this.shape + '; rotation num: ' + this.rot);
		}

		this.fall = function() {
			var tempBlocks = this.createTemp();
			for (var i = 0; i < this.blocks.length; i++) {
				tempBlocks[i].y++;
			};

			if (this.checkCollision(tempBlocks)) {
				console.log('block landed');
				recordBlock();
				actBlock = newActBlock();
				return;
			}

			this.blocks = tempBlocks;
		}

		this.moveLateral = function(dir) {
			if (dir == 'left') {
				dx = -1;
			} else if (dir == 'right') {
				dx = +1;
			}
			var tempBlocks = this.createTemp();
			for (var i = 0; i < this.blocks.length; i++) {
				tempBlocks[i] = {
					x : this.blocks[i].x + dx,
					y : this.blocks[i].y
				};

				//check for side collisions
				if (this.checkCollision(tempBlocks)) {
					console.log('lateral move blocked');
					return;
				}
			};
			this.blocks = tempBlocks;
		}

		this.createTemp = function() {
			var tempBlocks = [];
			for (var i = 0; i < this.blocks.length; i++) {
				tempBlocks[i] = {
					x : this.blocks[i].x,
					y : this.blocks[i].y
				};
			}
			return tempBlocks;
		}

		this.checkCollision = function(tempBlocks) {
			// if the block is inactive (that is on preview, don't check for collisions);
			if (!this.active) return;
			for (var i = 0; i < tempBlocks.length; i++) {
				var x = tempBlocks[i].x;
				var y = tempBlocks[i].y;
				//check for collisions with the walls and floor
				if (x > WELL_WIDTH - 1 || x < 0 || y > WELL_DEPTH - 1) {
					console.log('wall collision');
					return true;
				}
				//check for collisions with other blocks
				if (well.checkSquare(x, y)) {
					console.log('block collision');
					return true;
				}
			};
			return false;
		}
		
		this.activate = function(){
			this.blocks[0] = {x: 4, y: 0};
			this.rotate('redraw');
			this.active = true;
			if(this.checkCollision(this.blocks)){
				init();
			}
		}
		
		//figure out the shapes orientation
		this.rotate('redraw');
	}

	//draw a square
	function drawSquare(x, y, color) {
		x = x * BLOCK_SIZE + WELL_LEFT;
		y = y * BLOCK_SIZE + WELL_TOP;
		ctx.beginPath();
		ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
		ctx.fillStyle = color;
		ctx.fill();

		ctx.lineWidth = BLOCK_GAP;
		ctx.strokeStyle = BLOCK_BORDER_COLOR;
		ctx.stroke();
	}

	//draw score
	function scoreOut(){
		ctx.font = '15px Arial';
		ctx.strokeText('SCORE: ' + score, SCORE_LEFT + 1*BLOCK_SIZE, SCORE_TOP + 1*BLOCK_SIZE);
	}

	//clear screen and redraw well
	function clearScreen() {
		//draw the well
		ctx.beginPath();
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.lineWidth = WELL_THICKNESS;
		ctx.strokeStyle = WELL_BORDER_COLOR;
		ctx.rect(WELL_LEFT, WELL_TOP, WELL_WIDTH * BLOCK_SIZE, WELL_DEPTH * BLOCK_SIZE);
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath()
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.lineWidth = WELL_THICKNESS;
		ctx.strokeStyle = WELL_BORDER_COLOR;
		ctx.rect(PREV_LEFT, PREV_TOP, PREV_WIDTH * BLOCK_SIZE, PREV_DEPTH * BLOCK_SIZE);
		ctx.rect(SCORE_LEFT, SCORE_TOP, SCORE_WIDTH * BLOCK_SIZE, SCORE_DEPTH * BLOCK_SIZE);
		ctx.fill();
		ctx.stroke();
	}

	function newBlockShape() {
		var type = Math.round(Math.random() * 7);
		var shape;
		switch(type) {
			case 0:
				shape = "I"
				break;
			case 1:
				shape = "J"
				break;
			case 2:
				shape = "L"
				break;
			case 3:
				shape = "O"
				break;
			case 4:
				shape = "S"
				break;
			case 5:
				shape = "T"
				break;
			case 6:
				shape = "Z"
				break;
			case 7:
				shape = "I"
				break;
		}
		return shape;
	}
	
	function newActBlock() {
		if (nextBlock == undefined){
			newBlock = new Tetrom(newBlockShape());
		} else {
		var newBlock = nextBlock;
		}
		nextShape = newBlockShape();
		nextBlock = new Tetrom(nextShape);
		newBlock.activate();
		console.log('new act block: ' + nextShape);
		return newBlock;
	}

	function recordBlock() {
		for (var i = 0; i < actBlock.blocks.length; i++) {
			var x = actBlock.blocks[i].x;
			var y = actBlock.blocks[i].y;
			well.fillSquare(x, y, actBlock.color);
			//if the above is now 10, we clear the row.
		};
		console.log('piece recorded');

	}


	$(document).keydown(function(e) {
		var key = e.which;
		console.log('key pressed:' + key);
		if (key == '37')
			actBlock.moveLateral('left');
		else if (key == '38')
			actBlock.rotate();
		else if (key == '39')
			actBlock.moveLateral('right');
		else if (key == '40')
			speed = DOWN_SPEED;
		else if (key == '32') {
			paused = !paused;
			console.log('paused is now: ' + paused);
		}
	});

	$(document).keyup(function(e) {
		var key = e.which;
		if (key == '40'){
			speed = DEFAULT_SPEED;
		}
	});

	function flashRow(y, color) {
		for (var i = 0; i < WELL_WIDTH; i++) {
			drawSquare(i, y, color);
		}
	}

	//each of these objects will represent a square on the grid
	function gameWell() {
		this.grid = new Array(WELL_DEPTH);
		this.rowTotals = new Array(WELL_DEPTH);
		for (var i = 0; i < this.grid.length; i++) {
			var tempArray = new Array(WELL_WIDTH)
			for (var j = 0; j < tempArray.length; j++) {
				tempArray[j] = {
					filled : false,
					color : BACKGROUND_COLOR
				};
			}
			this.grid[i] = tempArray;
			this.rowTotals[i] = 0;
		}

		this.fillSquare = function(x, y, color) {
			this.grid[y][x] = {
				filled : true,
				color : color
			};
			this.rowTotals[y]++;
			if (this.rowTotals[y] >= WELL_WIDTH) {
				this.clearRow(y);
				score++;
			}
		}
		//rests the row total, and shifts the gameboard above down
		this.clearRow = function(y) {

			flashRow(y, 'silver');
			setTimeout(10000, flashRow(y, BACKGROUND_COLOR));
			setTimeout(10000, function() {});
			for (var i = y - 1; i >= 0; i--) {
				this.grid[i + 1] = this.grid[i];
				this.rowTotals[i + 1] = this.rowTotals[i];
			}
		}

		this.drawGrid = function() {
			//redraw the grid
			for (var i = 0; i < WELL_DEPTH; i++) {
				for (var j = 0; j < WELL_WIDTH; j++) {
					var square = this.grid[i][j];
					if (square.filled) {
						drawSquare(j, i, square.color);
					}
				}
			}
		}

		this.checkSquare = function(x, y) {
			return (this.grid[y][x].filled);
		}
	}

	init();
	gameLoop();

});
