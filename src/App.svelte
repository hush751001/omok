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


	function findHorizontalStartIndex(x, y, turn) {
		let i;
		for(i = 1; i < 5; i++) {
			if ((x - i) < 0) { break; }
			if (board[x - i][y] !== turn) { break; }
		}
		return {
			startXIndex: x - (i - 1),
			startYIndex: y
		}
	}
	function findVertialStartIndex(x, y, turn) {
		let i;
		for(i = 1; i < 5; i++) {
			if ((y - i) < 0) { break; }
			if (board[x][y - i] !== turn) { break; }
		}
		return {
			startXIndex: x,
			startYIndex: y - (i - 1)
		}
	}
	function findStartDiagonalIndex(x, y, turn) {
		let i;
		for(i = 1; i < 5; i++) {
			if ((y - i) < 0) { break; }
			if ((x - i) < 0) { break; }
			if (board[x - i][y - i] !== turn) { break; }
		}
		return {
			startXIndex: x - (i - 1),
			startYIndex: y - (i - 1)
		};
	}
	function findStartSkewDiagonalIndex(x, y, turn) {
		let i;
		for(i = 1; i < 5; i++) {
			if ((y + i) >= COLS_COUNT) { break; }
			if ((x - i) < 0) { break; }
			if (board[x - i][y + i] !== turn) { break; }
		}
		return {
			startXIndex: x - (i - 1),
			startYIndex: y + (i - 1)
		};
	}


	function checkHorizontalConsecutive(x, y, turn) {
		let { startXIndex } = findHorizontalStartIndex(x, y, turn);
		let i;
		for (i = 0; i < 5; i++) {
			if((startXIndex + i) >= COLS_COUNT) { break; }
			if (board[startXIndex + i][y] !== turn) { break; }
		}
		return (i === 5);
	}

	function checkVerticalConsecutive(x, y, turn) {
		let { startYIndex } = findVertialStartIndex(x, y, turn);
		let i;
		for (i = 0; i < 5; i++) {
			if((startYIndex + i) >= COLS_COUNT) { break; }
			if (board[x][startYIndex + i] !== turn) { break; }
		}
		return (i === 5);
	}

	function checkDiagonalConsecutive(x, y, turn) {
		let { startXIndex, startYIndex } = findStartDiagonalIndex(x, y, turn);
		let i;
		for (i = 0; i < 5; i++) {
			if((startXIndex + i) >= COLS_COUNT) { break; }
			if((startYIndex + i) >= COLS_COUNT) { break; }
			if (board[startXIndex + i][startYIndex + i] !== turn) { break; }
		}
		return (i === 5);
	}

	function checkSkewDiagonalConsecutive(x, y, turn) {
		let { startXIndex, startYIndex } = findStartSkewDiagonalIndex(x, y, turn);
		let i;
		for (i = 0; i < 5; i++) {
			if((startXIndex + i) >= COLS_COUNT) { break; }
			if((startYIndex - i) < 0) { break; }
			if (board[startXIndex + i][startYIndex - i] !== turn) { break;}
		}
		return (i === 5);
	}

	function checkWinner(x, y, turn) {
		// 1. - 축 확인
		if (checkHorizontalConsecutive(x, y, turn)) {
			return turn;
		}

		// 2. | 축 확인
		if (checkVerticalConsecutive(x, y, turn)) {
			return turn;
		}

		// 3. \ 확인
		if (checkDiagonalConsecutive(x, y, turn)) {
			return turn;
		}

		// 4. / 확인
		if (checkSkewDiagonalConsecutive(x, y, turn)) {
			return turn;
		}

		return false;
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