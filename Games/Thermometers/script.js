const percentage = 0.6; // percentage of cells to fill
const probFactor = 0.5; // probability of expanding the thermometer
const puzzleContainer = document.getElementById('puzzle-container');
var selectedDifficulty = document.querySelectorAll(".radio-group");
var difficulty = document.querySelector('input[name="difficulty"]:checked').value;
const reset = document.getElementById('reset');
const check = document.getElementById('check');
const show = document.getElementById('show');
const newGame = document.getElementById('newGame');
var numRows = 5;
var numCols = 5;
var grid = [];
var filled = [];
var answer = [];

function generateThermometers() {
    var puzzle = Array(numRows).fill().map(() => Array(numCols).fill(-1));
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (puzzle[row][col] != -1) continue;
            let tmp = getOrientation(row, col, puzzle);
            puzzle[row][col] = tmp;
            //expand in the direction of the orientation
            let prob = 1;
            switch (tmp) {
                case 0: // up
                    for (let i = 0; i < numRows; i++) {
                        if (i == row) continue;
                        if (puzzle[i][col] != -1) continue;
                        if (puzzle[i][col] != -1 && i > row) break;
                        if (Math.random() < prob) {
                            puzzle[i][col] = 0;
                            prob *= probFactor;
                        }
                        else break;
                    }
                    break;
                case 1: // right
                    for (let i = 0; i < numCols; i++) {
                        if (i == col) continue;
                        if (puzzle[row][i] != -1) continue;
                        if (puzzle[row][i] != -1 && i > col) break;
                        if (Math.random() < prob) {
                            puzzle[row][i] = 1;
                            prob *= probFactor;
                        }
                        else break;
                    }
                    break;
                case 2: // down
                    for (let i = 0; i < numRows; i++) {
                        if (i == row) continue;
                        if (puzzle[i][col] != -1) continue;
                        if (puzzle[i][col] != -1 && i > row) break;
                        if (Math.random() < prob) {
                            puzzle[i][col] = 2;
                            prob *= probFactor;
                        }
                        else break;
                    }
                    break;
                case 3: // left
                    for (let i = 0; i < numCols; i++) {
                        if (i == col) continue;
                        if (puzzle[row][i] != -1) continue;
                        if (puzzle[row][i] != -1 && i > col) break;
                        if (Math.random() < prob) {
                            puzzle[row][i] = 3;
                            prob *= probFactor;
                        }
                        else break;
                    }
            }
        }
    }
    return puzzle;
}

function getOrientation(row, col, table) {

    if (table[row][col] != -1) return table[row][col];

    // get neighbours orientation
    var up = NaN;
    var right = NaN;
    var down = NaN;
    var left = NaN;

    // border cases
    (row > 0) ? up = table[row - 1][col] : up = -1;
    (col < numCols - 1) ? right = table[row][col + 1] : right = -1;
    (row < numRows - 1) ? down = table[row + 1][col] : down = -1;
    (col > 0) ? left = table[row][col - 1] : left = -1;

    // neighbor possible equal orientation
    if (up == 1 || up == 3) up = NaN;
    if (right == 0 || right == 2) right = NaN;
    if (down == 1 || down == 3) down = NaN;
    if (left == 0 || left == 2) left = NaN;

    // array of neighbors
    var neighbors = [up, right, down, left];

    // remove NaN
    neighbors = neighbors.filter(function (el) {
        return !isNaN(el) && el != -1;
    });

    if (up == -1 || down == -1) neighbors.push(0, 2);
    if (right == -1 || left == -1) neighbors.push(1, 3);

    // remove duplicates
    neighbors = neighbors.filter(function (item, pos) {
        return neighbors.indexOf(item) == pos;
    });

    if (neighbors.length != 0)
        return neighbors[Math.floor(Math.random() * neighbors.length)]; //return one of the neighbors    

    return Math.floor(Math.random() * 4); // return a random orientation
}

function processCorrections() {
    let single = getSingles();

    // get adjacent singles
    let adj = [];
    for (let i = 0; i < single.length; i++) {
        for (let j = i + 1; j < single.length; j++) {
            if (single[i][0] == single[j][0] && Math.abs(single[i][1] - single[j][1]) == 1) {
                adj.push([single[i], single[j]]);
            }
            else if (single[i][1] == single[j][1] && Math.abs(single[i][0] - single[j][0]) == 1) {
                adj.push([single[i], single[j]]);
            }
        }
    }

    adj = mergeAdjacentCouples(adj);
    
    for (let i = 0; i < adj.length; i++) {
        let orientation = Math.floor(Math.random() * 2) * 2;
        if (adj[i][0][0] == adj[i][1][0]) orientation++;
        for (let k = 0; k < adj[i].length; k++)
            grid[adj[i][k][0]][adj[i][k][1]] = orientation;
    }
}

function placementCorrection() {
    let temp = JSON.parse(JSON.stringify(grid));
    while (true) {
        processCorrections();
        if (JSON.stringify(temp) == JSON.stringify(grid)) break;
        temp = JSON.parse(JSON.stringify(grid));
    }

    clearPuzzle();
    //displayThermometers(grid, answer);
}

function mergeAdjacentCouples(adjacentCouples) {
    const mergedCouples = [];

    for (const couple of adjacentCouples) {
        let merged = false;

        for (let i = 0; i < mergedCouples.length; i++) {
            const mergedCouple = mergedCouples[i];

            if (mergedCouple.some(cell => couple.includes(cell))) {
                // Check if the couple is adjacent along a row or column
                if (
                    (mergedCouple[0][0] === mergedCouple[1][0] && couple[0][0] === couple[1][0]) ||
                    (mergedCouple[0][1] === mergedCouple[1][1] && couple[0][1] === couple[1][1])
                ) {
                    mergedCouple.push(...couple.filter(cell => !mergedCouple.includes(cell)));
                    merged = true;
                    break;
                }
            }
        }

        if (!merged) {
            mergedCouples.push(couple);
        }
    }

    //sort by length, shortest first
    mergedCouples.sort(function (a, b) {
        return a.length - b.length;
    });

    return mergedCouples;
}

function getSingles() {
    var single = [];

    // find placement of single orientation
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let up = NaN;
            let right = NaN;
            let down = NaN;
            let left = NaN;
            if (row > 0) up = grid[row - 1][col];
            if (col < numCols - 1) right = grid[row][col + 1];
            if (row < numRows - 1) down = grid[row + 1][col];
            if (col > 0) left = grid[row][col - 1];
            // if different from all the neighbors
            let curr = grid[row][col];
            if (curr == 0 && up != 0 && down != 0) single.push([row, col]);
            if (curr == 1 && right != 1 && left != 1) single.push([row, col]);
            if (curr == 2 && up != 2 && down != 2) single.push([row, col]);
            if (curr == 3 && right != 3 && left != 3) single.push([row, col]);
        }
    }

    return single;
}

function generateThermometers_OLD() {
    var puzzle = Array(numRows).fill().map(() => Array(numCols).fill(-1));

    for (let row = 0; row < numRows; row++) {

        for (let col = 0; col < numCols; col++) {
            // if cell is empty
            if (puzzle[row][col] == -1) {
                // generate a thermomether with random orientation
                var orientation = Math.floor(Math.random() * 4);

                if (row == 0) {
                    if (orientation == 0) orientation = 2;
                    else if (orientation == 3) orientation = 1;
                }
                else if (row == numRows - 1) {
                    if (orientation == 2) orientation = 0;
                    else if (orientation == 1) orientation = 3;
                }
                else if (col == 0) {
                    if (orientation == 0) orientation = 3;
                    else if (orientation == 1) orientation = 2;
                }
                else if (col == numCols - 1) {
                    if (orientation == 3) orientation = 0;
                    else if (orientation == 2) orientation = 1;
                }

                // set the cell as the start of the thermometer
                puzzle[row][col] = orientation;

                // check the space available for the thermometer
                let space = 0;
                switch (orientation) {
                    case 0: // up
                        for (let i = row - 1; i > 0; i--) {
                            if (puzzle[i][col] == -1)
                                space++;
                            else
                                break;
                        }
                        break;
                    case 1: // right
                        for (let i = col + 1; i < numCols; i++) {
                            if (puzzle[row][i] == -1)
                                space++;
                            else
                                break;
                        }
                        break;
                    case 2: // down
                        for (let i = row + 1; i < numRows; i++) {
                            if (puzzle[i][col] == -1)
                                space++;
                            else
                                break;
                        }
                        break;
                    case 3: // left
                        for (let i = col - 1; i > 0; i--) {
                            if (puzzle[row][i] == -1)
                                space++;
                            else
                                break;
                        }
                        break;
                }

                // generate a thermometer with random length
                var length = Math.floor(Math.random() * space);

                // fill the thermometer
                switch (orientation) {
                    case 0: // up
                        for (let i = row; i < row - length - 1; i++) {
                            puzzle[i][col] = 0;
                        }
                        break;
                    case 1: // right
                        for (let i = col; i < col + length + 1; i++) {
                            puzzle[row][i] = 1;
                        }
                        break;
                    case 2: // down
                        for (let i = row; i < row + length + 1; i++) {
                            puzzle[i][col] = 2;
                        }
                        break;
                    case 3: // left
                        for (let i = col; i < col - length - 1; i++) {
                            puzzle[row][i] = 3;
                        }
                        break;
                }
            }
        }
    }
    return puzzle;
}

function displayThermometers(puzzle, fill) {

    var temp = countFilled();
    var rows = temp[0];
    var cols = temp[1];

    // header for columns
    const colHeaderRow = document.createElement('div');
    colHeaderRow.classList.add('row');
    for (let col = -1; col < numCols; col++) {
        const colHeaderCell = document.createElement('div');
        colHeaderCell.classList.add('cell');
        if (col == -1) colHeaderCell.textContent = '';
        else colHeaderCell.textContent = cols[col];

        colHeaderRow.appendChild(colHeaderCell);
    }
    puzzleContainer.appendChild(colHeaderRow);


    for (let row = 0; row < numRows; row++) {

        const rowElement = document.createElement('div');
        rowElement.classList.add('row'); // Add the 'row' class to each row element

        //header for rows
        const rowHeaderCell = document.createElement('div');
        rowHeaderCell.classList.add('cell');
        rowHeaderCell.textContent = rows[row];
        rowElement.appendChild(rowHeaderCell); // Append the row header to the row element

        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            //set cell attributes row and col
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Set the content based on the puzzle data
            const cellData = puzzle[row][col];
            const img = document.createElement('img');
            switch (cellData) {
                case -1: // Empty cell
                    cell.textContent = '';
                    break;
                case 0: // Up orientation
                    if (row < numRows - 1 && grid[row + 1][col] == 0)
                        if (row > 0 && grid[row - 1][col] == 0)
                            if (fill[row][col] == 1)
                                img.src = './src/vertical_open_filled.png';
                            else
                                img.src = './src/vertical_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/up_closed_filled.png';
                            else
                                img.src = './src/up_closed.png';
                    else
                        if (row > 0 && grid[row - 1][col] == 0)
                            if (fill[row][col] == 1)
                                img.src = './src/up_base_open_filled.png';
                            else
                                img.src = './src/up_base_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/up_base_closed_filled.png';
                            else
                                img.src = './src/up_base_closed.png';
                    break;
                case 1: // Right orientation
                    if (col > 0 && grid[row][col - 1] == 1)
                        if (col < numCols - 1 && grid[row][col + 1] == 1)
                            if (fill[row][col] == 1)
                                img.src = './src/horizontal_open_filled.png';
                            else
                                img.src = './src/horizontal_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/right_closed_filled.png';
                            else
                                img.src = './src/right_closed.png';
                    else
                        if (col < numCols - 1 && grid[row][col + 1] == 1)
                            if (fill[row][col] == 1)
                                img.src = './src/right_base_open_filled.png';
                            else
                                img.src = './src/right_base_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/right_base_closed_filled.png';
                            else
                                img.src = './src/right_base_closed.png';
                    break;
                case 2: // Down orientation
                    if (row > 0 && grid[row - 1][col] == 2)
                        if (row < numRows - 1 && grid[row + 1][col] == 2)
                            if (fill[row][col] == 1)
                                img.src = './src/vertical_open_filled.png';
                            else
                                img.src = './src/vertical_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/down_closed_filled.png';
                            else
                                img.src = './src/down_closed.png';
                    else
                        if (row < numRows - 1 && grid[row + 1][col] == 2)
                            if (fill[row][col] == 1)
                                img.src = './src/down_base_open_filled.png';
                            else
                                img.src = './src/down_base_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/down_base_closed_filled.png';
                            else
                                img.src = './src/down_base_closed.png';
                    break;
                case 3: // Left orientation
                    if (col < numCols - 1 && grid[row][col + 1] == 3)
                        if (col > 0 && grid[row][col - 1] == 3)
                            if (fill[row][col] == 1)
                                img.src = './src/horizontal_open_filled.png';
                            else
                                img.src = './src/horizontal_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/left_closed_filled.png';
                            else
                                img.src = './src/left_closed.png';
                    else
                        if (col > 0 && grid[row][col - 1] == 3)
                            if (fill[row][col] == 1)
                                img.src = './src/left_base_open_filled.png';
                            else
                                img.src = './src/left_base_open.png';
                        else
                            if (fill[row][col] == 1)
                                img.src = './src/left_base_closed_filled.png';
                            else
                                img.src = './src/left_base_closed.png';
                    break;
            }

            // rescale the image
            img.style.width = '100%';
            img.style.height = '100%';
            // Append the image to the cell
            cell.appendChild(img);

            rowElement.appendChild(cell); // Append the cell to the row element
        }

        puzzleContainer.appendChild(rowElement); // Append the row element to the container
    }
}

function randomFill() {

    // number of cells to fill
    const numCells = Math.floor(numRows * numCols * percentage);
    var count = numCells;

    // array of number from 0 to numRow * numCols
    var cells = Array(numRows * numCols).fill().map((_, i) => i);
    filled = Array(numRows).fill().map(() => Array(numCols).fill(0));

    // shuffle the array
    cells.sort(() => Math.random() - 0.5);

    // start filling the cells following the shuffled array
    for (let i = 0; i < numCells; i++) {
        let row = Math.floor(cells[i] / numCols);
        let col = cells[i] % numCols;

        // check if the cell is already filled
        if (filled[row][col] == 1) continue;

        // check if is fillable
        let temp = 0;
        switch (grid[row][col]) {
            case 0: // up
                for (let i = row; i < numRows; i++) {
                    if (grid[i][col] == 0 && filled[i][col] == 0)
                        temp++;
                }
                if (temp <= count) {
                    for (let i = row; i < numRows; i++) {
                        if (grid[i][col] == 0 && filled[i][col] == 0) {
                            filled[i][col] = 1;
                            count--;
                        }
                    }
                }
                break;
            case 1: // right
                for (let i = col; i >= 0; i--) {
                    if (grid[row][i] == 1 && filled[row][i] == 0)
                        temp++;
                }
                if (temp <= count) {
                    for (let i = col; i >= 0; i--) {
                        if (grid[row][i] == 1 && filled[row][i] == 0) {
                            filled[row][i] = 1;
                            count--;
                        }
                    }
                }
                break;
            case 2: // down
                for (let i = row; i >= 0; i--) {
                    if (grid[i][col] == 2 && filled[i][col] == 0)
                        temp++;
                }
                if (temp <= count) {
                    for (let i = row; i >= 0; i--) {
                        if (grid[i][col] == 2 && filled[i][col] == 0) {
                            filled[i][col] = 1;
                            count--;
                        }
                    }
                }
                break;
            case 3: // left
                for (let i = col; i < numCols; i++) {
                    if (grid[row][i] == 3 && filled[row][i] == 0)
                        temp++;
                }
                if (temp <= count) {
                    for (let i = col; i < numCols; i++) {
                        if (grid[row][i] == 3 && filled[row][i] == 0) {
                            filled[row][i] = 1;
                            count--;
                        }
                    }
                }
                break;
        }

    }
}

function countFilled() {
    var rows = Array(numRows).fill(0);
    var cols = Array(numCols).fill(0);
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (filled[row][col] == 1) {
                rows[row]++;
                cols[col]++;
            }
        }
    }
    return [rows, cols];
}

function beautification() {
    //get cells height and width
    var cells = document.getElementsByClassName('cell');
    var cellHeight = cells[0].offsetHeight;
    var cellWidth = cells[0].offsetWidth;
    var puzzleHeight = (numRows + 1) * cellHeight + numRows*2;
    var puzzleWidth = (numCols + 1) * cellWidth + numCols*2;

    // adjust the puzzle container
    puzzleContainer.style.width = puzzleWidth + 'px';
    puzzleContainer.style.height = puzzleHeight + 'px';
    puzzleContainer.style.margin = 'auto';
}

function clearPuzzle() {
    while (puzzleContainer.firstChild) {
        puzzleContainer.removeChild(puzzleContainer.firstChild);
    }
}

function start() {
    grid = generateThermometers();
    placementCorrection();
    answer = Array(numRows).fill().map(() => Array(numCols).fill(0));
    placementCorrection();
    randomFill();
    displayThermometers(grid, answer);
    

    // Beautification
    beautification();
    
}

// DIFFICULTY
function handleDifficultyChange(event) {
    diff = parseInt(event.target.value);
    numCols = diff;
    numRows = diff;
    clearPuzzle();
    start();
  }
  selectedDifficulty.forEach(group => {
    group.addEventListener("change", handleDifficultyChange);
  });

// RESET
reset.addEventListener('click', () => {
    clearPuzzle();
    answer = Array(numRows).fill().map(() => Array(numCols).fill(0));
    displayThermometers(grid, answer);
});

// CHECK
check.addEventListener('click', () => {

    let temp = countFilled();
    let rows = temp[0];
    let cols = temp[1];

    // check if the number of filled cells is correct
    for (let row = 0; row < numRows; row++) {
        // count filled in the row
        let count = 0;
        for (let col = 0; col < numCols; col++) {
            if (answer[row][col] == 1) count++;
        }
        if (count != rows[row]) {
            alert('Wrong! Try again.');
            return;
        }
    }
    for (let col = 0; col < numCols; col++) {
        // count filled in the column
        let count = 0;
        for (let row = 0; row < numRows; row++) {
            if (answer[row][col] == 1) count++;
        }
        if (count != cols[col]) {
            alert('Wrong! Try again.');
            return;
        }
    }

    alert('Correct!');
    // hide buttons
    reset.style.display = 'none';
    check.style.display = 'none';
    show.style.display = 'none';
    newGame.style.display = 'inline-block';
});

// SHOW
show.addEventListener('click', () => {
    clearPuzzle();
    displayThermometers(grid, filled);

    // hide buttons
    reset.style.display = 'none';
    check.style.display = 'none';
    show.style.display = 'none';
    newGame.style.display = 'inline-block';
});

// NEW GAME
newGame.addEventListener('click', () => {
    clearPuzzle();
    start();
    reset.style.display = 'inline-block';
    check.style.display = 'inline-block';
    show.style.display = 'inline-block';
    newGame.style.display = 'none';
});

// click on a cell
puzzleContainer.addEventListener('click', (e) => {
    // get the cell
    var cell = e.target;
    while (cell.className != 'cell') {
        cell = cell.parentNode;
    }

    // get row and col
    var row = parseInt(cell.dataset.row);
    var col = parseInt(cell.dataset.col);

    if (isNaN(row) || isNaN(col)) return;

    // get the image name
    var img = cell.firstChild;
    var src = img.src.split('/');
    var name = src[src.length - 1].split('.')[0];

    // change the image
    switch (answer[row][col]) {
        case 0: //empty
            //change the image
            name += '_filled.png';
            img.src = './src/' + name;
            answer[row][col] = 1;
            break;
        case 1: //filled
            name = name.replace('_filled', '_cross') + '.png';
            img.src = './src/' + name;
            answer[row][col] = 2;
            break;
        case 2: //crossed
            name = name.replace('_cross', '') + '.png';
            img.src = './src/' + name;
            answer[row][col] = 0;
            break;
    }
});


start();





