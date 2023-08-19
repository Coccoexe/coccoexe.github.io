var x = ['+', '-', '*', '/'];
var selectedDifficulty = document.querySelectorAll(".radio-group");
var difficulty = document.querySelector('input[name="difficulty"]:checked').value;
var digitsContainer = document.getElementById("digits-container");
var equationTable = document.getElementById("equation-table");
var inputRow = document.getElementById("input-row");
var digits = digitsContainer.querySelectorAll(".digit");
var guessButton = document.getElementById("guess-button");
var equation = '';
var ans = '';
var row = null;


var TreeNode = function(left, right, operator) {
  this.left = left;
  this.right = right;
  this.operator = operator;

  if (difficulty > 4) {
    this.toString = function() {
      return '(' + left + ' ' + operator + ' ' + right + ')';
    }
  } else {
    this.toString = function() {
      return left + ' ' + operator + ' ' + right;
    }
  }
}

function randomNumberRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function buildTree(numNodes) {
  if (numNodes === 1)
    return randomNumberRange(1, 100);

  var numLeft = Math.floor(numNodes / 2);
  var leftSubTree = buildTree(numLeft);
  var numRight = Math.ceil(numNodes / 2);
  var rightSubTree = buildTree(numRight);

  var m = randomNumberRange(0, x.length);
  var str = x[m];
  return new TreeNode(leftSubTree, rightSubTree, str);
}

function generateEquation() {
  let tree = buildTree(difficulty);
  while (eval(tree.toString()) < 0 || eval(tree.toString()) > 999 || eval(tree.toString()) % 1) {
    tree = buildTree(difficulty);
  }
  equation = tree.toString() + ' = ' + eval(tree.toString());
}

function clearTable() {
  while (equationTable.firstChild) {
    equationTable.removeChild(equationTable.firstChild);
  }
}

function createTable() {
  var inputRow = document.createElement("tr");
  inputRow.id = "input-row";

  equation = equation.replace(/\s/g, '');

  // Initialize the input row with editable cells
  for (var i = 0; i < equation.length; i++) {
    var cell = document.createElement("td");
    
    var input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.value = "";
    cell.appendChild(input);
    
    inputRow.appendChild(cell);
  }
  equationTable.appendChild(inputRow);
  row = inputRow;
}

function checkAnswer(ans) {

  for (var i = 0; i < ans.length; i++) {
    // if the value is the same color it green
    if (ans[i] === equation[i]) {
      row.children[i].style.backgroundColor = "green";
    } else {
      // if the value is in the equation but in the wrong position it color it orange
      if (equation.includes(ans[i])) {
        row.children[i].style.backgroundColor = "orange";
      }
      // if the value is not in the equation it color it red
      else {
        row.children[i].style.backgroundColor = "red";
      }
    }
  }
}

// DRAG AND DROP -----------------

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.textContent);
}

function digitClick(e) {
  var clickedDigit = e.target;
  var inputElements = document.querySelectorAll("#input-row > td > input[type=text]");
  inputElements = Array.from(inputElements).slice(-equation.length);
  // Find the first empty input
  var emptyInput = inputElements.find(function(inputElement) {
    return inputElement.value === "";
  });
  if (emptyInput) {
    emptyInput.value = clickedDigit.textContent;
  }
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  var data = e.dataTransfer.getData("text/plain");
  var target = e.target;
  
  target.value = data;
}

digits.forEach(function(digit) {
  digit.setAttribute("draggable", true);
  digit.addEventListener("dragstart", dragStart);
  digit.addEventListener("click", digitClick);
});

// Allow cells to accept drops
equationTable.addEventListener("dragover", allowDrop);
equationTable.addEventListener("drop", drop);

// -------------------------------

// DIFFICULTY 
function handleDifficultyChange(event) {
  difficulty = event.target.value;
  clearTable();
  generateEquation();
  createTable();
}
selectedDifficulty.forEach(group => {
  group.addEventListener("change", handleDifficultyChange);
});

// CLEAR
function handleClear() {
  var inputElements = document.querySelectorAll("#input-row > td > input[type=text]");
  inputElements = Array.from(inputElements).slice(-equation.length);
  inputElements.forEach(function(inputElement) {
    inputElement.value = "";
  });
}
document.getElementById("clear-button").addEventListener("click", handleClear);

// GUESS
function handleGuess() {
  ans = '';
  // Get the input element only last row
  var inputElements = document.querySelectorAll("#input-row > td > input[type=text]");
  inputElements = Array.from(inputElements).slice(-equation.length);
  inputElements.forEach(function(inputElement) {
    ans += inputElement.value;
  });

  //if equation is not complete or does not make sense
  if (ans.length < equation.length){alert("Equation is not complete!"); return;}
  //find = in ans
  var index = ans.indexOf('=');
  if (index == -1){alert("The equal is mandatory"); return;}
  //split ans in two parts
  var ans1 = ans.slice(0, index);
  var ans2 = ans.slice(index+1);
  if (eval(ans1) != ans2){alert("The equation is not correct"); return;}
  
  checkAnswer(ans);

  //lock the input
  inputElements.forEach(function(inputElement) {
    inputElement.disabled = true;
  });

  if (ans === equation) {
    //lock the button
    guessButton.disabled = true;

    var win = document.createElement("h1");
    win.textContent = "You win!";
    //rainbow text
    win.style.backgroundImage = "linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red)";
    win.style.webkitBackgroundClip = "text";
    win.style.webkitTextFillColor = "transparent";
    win.style.fontSize = "100px";
    document.body.appendChild(win);
    return;
  }

  //create a new row
  createTable();

}
guessButton.addEventListener("click", handleGuess);


generateEquation();
createTable();





