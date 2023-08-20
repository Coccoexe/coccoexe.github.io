const percentage = 0.6; // percentage of cells to fill
const numRows = 5;
const numCols = 5;
const puzzleContainer = document.getElementById('puzzle-container');
const reset = document.getElementById('reset');
const check = document.getElementById('check');
const show = document.getElementById('show');
const newGame = document.getElementById('newGame');
var grid = [];
var filled = [];
var answer = [];

function generateThermometers() {
    var puzzle = Array(numRows).fill().map(() => Array(numCols).fill(-1));

    for (let row = 0; row < numRows; row++) {

        for (let col = 0; col < numCols; col++) {
            // if cell is empty
            if (puzzle[row][col] == -1) {
                // generate a thermomether with random orientation
                var orientation = Math.floor(Math.random() * 4);

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
                    if (row < numRows - 1 && grid[row+1][col] == 0)
                        if (row > 0 && grid[row-1][col] == 0)
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
                        if (row > 0 && grid[row-1][col] == 0)
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
                    if (col > 0 && grid[row][col-1] == 1)
                        if (col < numCols - 1 && grid[row][col+1] == 1)
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
                        if (col < numCols - 1 && grid[row][col+1] == 1)
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
                    if (row > 0 && grid[row-1][col] == 2)
                        if (row < numRows - 1 && grid[row+1][col] == 2)
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
                        if (row < numRows - 1 && grid[row+1][col] == 2)
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
                    if (col < numCols - 1 && grid[row][col+1] == 3)
                        if (col > 0 && grid[row][col-1] == 3)
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
                        if (col > 0 && grid[row][col-1] == 3)
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
                if (temp <= count)
                {
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
                if (temp <= count)
                {
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
                if (temp <= count)
                {
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
                if (temp <= count)
                {
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

function countFilled(){
    var rows = Array(numRows).fill(0);
    var cols = Array(numCols).fill(0);
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++){
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
    var puzzleHeight = (numRows+1) * cellHeight + 1;
    var puzzleWidth = (numCols+1) * cellWidth + 1;

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
    answer = Array(numRows).fill().map(() => Array(numCols).fill(0));
    randomFill();
    displayThermometers(grid, answer);

    // Beautification
    beautification();
}

// RESET
reset.addEventListener('click', () => {
    clearPuzzle();
    answer = Array(numRows).fill().map(() => Array(numCols).fill(0));
    displayThermometers(grid, answer);
});

// CHECK
check.addEventListener('click', () => {

    let ans = JSON.stringify(answer).replace('2', '0');
    let fil = JSON.stringify(filled);

    if (ans == fil) {
        alert('Correct!');
        // hide buttons
        reset.style.display = 'none';
        check.style.display = 'none';
        show.style.display = 'none';
        newGame.style.display = 'inline-block';
    } else {
        alert('Wrong!');
    }
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






