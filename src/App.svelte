<script>
	export let name;

	const BLOCK_SIZE = 26;
	const CIRCLE_SIZE = 26 / 1.3;
	const BORDER_SIZE = 20;
	const COLS_COUNT = 19;
	let turn = '흑돌';
	let board = [];
	let lastDoings = [];

	const BOARD_SIZE = BORDER_SIZE + (BLOCK_SIZE * (COLS_COUNT - 1)) + BORDER_SIZE;

	document.addEventListener('DOMContentLoaded', () => {
		const canvas = document.getElementById('canvas_omok');
		canvas.setAttribute('width', BOARD_SIZE);
		canvas.setAttribute('height', BOARD_SIZE);

		clearBoard();

		canvas.addEventListener('click', (e) => {
			const ratio = e.target.clientHeight / BOARD_SIZE;
			const x = Math.round((e.offsetX / ratio) / BLOCK_SIZE) - 1;
			const y = Math.round((e.offsetY / ratio) / BLOCK_SIZE) - 1;

			if (board[x][y] === '없음') {
				board[x][y] = turn;
				// 마지막 수 저장
				lastDoings.push({ x, y });
				drawCircle(x, y, turn);
				const winner = checkWinner(x, y, turn);
				if (winner) {
					setTimeout(() => {
						alert(winner + ' 승!!!!!');
						clearBoard();
					}, 100);
					return;
				}
				toggleTurn();
			}
		});

		const backButton = document.getElementById('back');
		backButton.addEventListener('click', () => {
			if (lastDoings.length > 0) {
				toggleTurn();
				const lastDo = lastDoings.pop();
				board[lastDo.x][lastDo.y] = '없음';
				drawBoard();
				drawCircles();
			}
		});
	});

	function toggleTurn() {
		if (turn === '백돌') {
			turn = '흑돌';
		} else {
			turn = '백돌';
		}
	}

	function drawBoard() {
		const canvas = document.getElementById('canvas_omok');
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#e8a755';
		ctx.fillRect (0, 0, BOARD_SIZE, BOARD_SIZE);

		ctx.strokeStyle = '#000000';
		ctx.beginPath();
		for (let i = 0; i < COLS_COUNT; i++) {
			ctx.moveTo(BORDER_SIZE + (BLOCK_SIZE * i), BORDER_SIZE);
			ctx.lineTo(BORDER_SIZE + (BLOCK_SIZE * i), BORDER_SIZE + (BLOCK_SIZE * (COLS_COUNT-1)));
			ctx.moveTo(BORDER_SIZE, BORDER_SIZE + (BLOCK_SIZE * i));
			ctx.lineTo(BORDER_SIZE + (BLOCK_SIZE * (COLS_COUNT-1)), BORDER_SIZE + (BLOCK_SIZE * i));
		}
		
		ctx.stroke();
	}

	function drawCircles() {
		for (let x = 0; x < COLS_COUNT; x++) {
			for (let y = 0; y < COLS_COUNT; y++) {
				if (board[x][y] !== '없음') {
					drawCircle(x, y, board[x][y]);
				}
			}
		}
	}

	function clearBoard() {
		turn = '흑돌';
		lastDoings = [];
		board = [];
		for (let x = 0; x < COLS_COUNT; x++) {
			for (let y = 0; y < COLS_COUNT; y++) {
				board[x] = board[x] || [];
				board[x][y] = '없음';
			}
		}

		drawBoard();
	}

	function drawCircle(x, y, turn) {
		const canvas = document.getElementById('canvas_omok');
		const ctx = canvas.getContext('2d');
		if (turn === '흑돌') {
			ctx.fillStyle = '#000000';
		} else {
			ctx.fillStyle = '#ffffff';
		}
		ctx.beginPath();
		ctx.arc(BORDER_SIZE + (BLOCK_SIZE * x), BORDER_SIZE + (BLOCK_SIZE * y), CIRCLE_SIZE/2, 0, Math.PI * 2, true);
		ctx.fill();
	}

	function checkWinner(x, y, turn) {
		let horizontalInfo = {
			x, y,
			count: 0,
			skipEven: false,
			skipOdd: false,
			block: []
		};
		let verticalInfo = {
			x, y,
			count: 0,
			skipEven: false,
			skipOdd: false,
			block: []
		};
		let diagonalInfo = {
			x, y,
			count: 0,
			skipEven: false,
			skipOdd: false,
			block: []
		};
		let skewDiagonalInfo = {
			x, y,
			count: 0,
			skipEven: false,
			skipOdd: false,
			block: []
		};

		let sign = 1;
		for (let i = 1; i <= 8; i++) {
			const signI = i * sign;
			pushInfo(horizontalInfo, signI, (info) => (info.x = info.x + signI));
			pushInfo(verticalInfo, signI, (info) => (info.y = info.y + signI));
			pushInfo(diagonalInfo, signI, (info) => (info.x = info.x + signI, info.y = info.y + signI));
			pushInfo(skewDiagonalInfo, signI, (info) => (info.x = info.x + signI, info.y = info.y - signI));

			sign *= -1;
		}

		for (let i = 0; i < 4; i++) {
			accumulateCount(horizontalInfo, i);
			accumulateCount(verticalInfo, i);
			accumulateCount(diagonalInfo, i);
			accumulateCount(skewDiagonalInfo, i);
		}

		if (horizontalInfo.count >= 4 || 
			verticalInfo.count >= 4 ||
			diagonalInfo.count >= 4 ||
			skewDiagonalInfo.count >= 4) {
				return turn;
			}
		return false;
	}

	function pushInfo(info, i, moveCallback) {
		moveCallback(info);
		if ((info.x < 0 || info.x > (COLS_COUNT - 1)) || (info.y < 0 || info.y > (COLS_COUNT - 1))) {
			info.block.push(null);
		} else {
			info.block.push(board[info.x][info.y]);
		}
	}
	function accumulateCount(info, i) {
		if (!info.skipEven && info.block[i*2] === turn) {
			info.count++;
		} else {
			info.skipEven = true;
		}
		if (!info.skipOdd && info.block[(i*2)+1] === turn) {
			info.count++;
		} else {
			info.skipOdd = true;
		}
	}

</script>

<main>
	<h1>Hello {name}!</h1><button id="back">한수 뒤로</button>
	<div style="width:100vw; height: 100vw">
		<canvas id="canvas_omok"></canvas>
	</div>
</main>

<style>
	#canvas_omok {
		width: 100%;
		height: 100%;
	}

	#back {
		margin-left: 10px;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 1.3em;
		font-weight: 100;
		margin-left: 10px;
	}
</style>