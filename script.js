let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 300;

let rows = 3;
let cols = 3;
let size = 100;
let baseColor = 'aliceblue';
let start = false;

let group = document.getElementById('group');
let easy = document.getElementById('easy');
let hard = document.getElementById('hard');
let comp = document.getElementById('comp');
let user = document.getElementById('user');
let player = 'player', opponent = 'computer';
let startfirst = null;

class Cell{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.owner = null;
        this.neighbors = [];
    }

    clear(){
        ctx.fillStyle = baseColor;
        ctx.fillRect(this.x, this.y, size, size);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(this.x, this.y, size, size);
    }

    renderPlayer(){
        this.owner = player;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 7;
        ctx.beginPath()
        ctx.arc(this.x+size/2, this.y+size/2, size/3, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();
    }
    renderComputer(){
        this.owner = opponent;
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 7;
        ctx.beginPath()
        ctx.moveTo(this.x+ size/4, this.y+size/4);
        ctx.lineTo(this.x+size*3/4, this.y+size*3/4);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath()
        ctx.moveTo(this.x+ size/4, this.y+size*3/4);
        ctx.lineTo(this.x+size*3/4, this.y+size/4);
        ctx.stroke();
        ctx.closePath();
    }
}

let Board = [];

function initBoard(){
    for (let row = 0; row<rows; row++){
        let cellRow = [];
        for (let col = 0; col<cols; col++){
            let cell = new Cell(col*size, row*size, baseColor);

               /**   filling up cell's neighbors  */
             
             if (row>0){
                /* north*/
                cell.neighbors.push(Board[row-1][cellRow.length]);
                /* south */
                Board[row-1][cellRow.length].neighbors.push(cell);
                /*  north east */
                if (Board[row-1][col+1] != null){
                    cell.neighbors.push(Board[row-1][col+1]);
                /* south west */
                    Board[row-1][col+1].neighbors.push(cell);
                }
                /*  north west */
                if (Board[row-1][col-1] != null){
                    cell.neighbors.push(Board[row-1][col-1]);
                /* south west */
                    Board[row-1][col-1].neighbors.push(cell);
                }
            }
         
            if (col>0){
                /* west */
                cell.neighbors.push(cellRow[cellRow.length-1]);
                /* east */
                cellRow[cellRow.length-1].neighbors.push(cell);
            }

            cell.clear();
            cellRow.push(cell);
        }
        Board.push(cellRow);
    }
}
initBoard();

let algo = null;
easy.addEventListener('click',()=> {
    start=true;
    algo = computerPlayEasy;
    if (startfirst===player) computerPlayEasy();
});
hard.addEventListener('click',()=> {
    start=true;
    algo = computerPlayHard;
    if (startfirst===opponent) computerPlayHard();
});

comp.addEventListener('click', ()=>{
    if (startfirst==null) startfirst = opponent;
});
user.addEventListener('click', ()=>{
    if (startfirst==null) startfirst = player;
});


canvas.addEventListener('click', play);
let chances = 9;
let moves = 0;
function play(ev){
    if (start){
        group.style.visibility = 'hidden';
        let clientX = ev.clientX - canvas.offsetLeft;
        let clientY = ev.clientY - canvas.offsetTop;
        if (chances>0){
            Board.forEach(cellRow =>
                cellRow.forEach(cell=>{
                if (clientX > cell.x && clientX < cell.x + size &&
                    clientY > cell.y && clientY < cell.y + size &&
                    cell.owner == null){
                        cell.renderPlayer();
                        chances--;
                        if (checkForWiner(player)) result("you won !!");
                        else if (checkForWiner(opponent)) result("You lost !!");
                        else if (isMovesLeft(Board)) setTimeout(algo, 500);
                        else result("Tie !!");
                    
                    }
            }))
            
        }
    }
}

function result(text){
    ctx.fillStyle = 'black';
    ctx.font = "50px arial";
    ctx.fillText(text, 50, canvas.height/2);
}


function findAvailableSpot(board){
    let availableSpot = []
    board.forEach(row=>row.forEach(col=>{
        if (col.owner == null) availableSpot.push(col);
    }));
    return availableSpot;
}
function getRandomMove(availableSpot){
    let randomMove = Math.floor(Math.random()*availableSpot.length);
    return availableSpot[randomMove];
}

let computerPlayEasy = function (){
    if (isMovesLeft(Board)){
        let randomMove = getRandomMove(findAvailableSpot(Board));
        randomMove.renderComputer();
        randomMove.owner = opponent;
        chances--;
        if (checkForWiner(player)) result("you won !!");
        else {if (checkForWiner(opponent)) {result("You lost !!");}}
        if (!isMovesLeft(Board)) result("Tie !!");
        return;
    }
    
}


const computerPlayHard = function(){
    let bestMove = findBestMove(Board);
    bestMove.renderComputer(); 
    if (checkForWiner(player)) result("you won !!");
    else if (checkForWiner(opponent)) result("You lost !!");
    else if (!isMovesLeft(Board)) result("Tie !!");
}
    

 
 

 

function isMovesLeft(board){
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (board[i][j].owner == null)
                return true;
                 
    return false;
}

function checkForWiner(p){
    if(
      (Board[0][0].owner===p && Board[0][1].owner===p && Board[0][2].owner===p) ||
      (Board[1][0].owner===p && Board[1][1].owner===p && Board[1][2].owner===p) ||
      (Board[2][0].owner===p && Board[2][1].owner===p && Board[2][2].owner===p) ||
      (Board[0][0].owner===p && Board[1][0].owner===p && Board[2][0].owner===p) ||
      (Board[0][1].owner===p && Board[1][1].owner===p && Board[2][1].owner===p) ||
      (Board[0][2].owner===p && Board[1][2].owner===p && Board[2][2].owner===p) ||
      (Board[0][0].owner===p && Board[1][1].owner===p && Board[2][2].owner===p) ||
      (Board[2][0].owner===p && Board[1][1].owner===p && Board[0][2].owner===p))
          return true;
    else return false;
}
 

function minimax(board, depth, isMax)
{  
   if (checkForWiner(player)) return -1;
   if (checkForWiner(opponent)) return 1; 
  
   if (isMovesLeft(board) == false)
        return 0;
     
    if (isMax){
        let best = -1000;
        board.forEach(row=>row.forEach(col=>{
            if (col.owner==null){
                col.owner = opponent;
                best = Math.max(best, minimax(board, depth + 1, false));
                col.owner = null;
            }
        }))
                
          return best;   
    }
    else {
        let best = 1000;
        board.forEach(row=>row.forEach(col=>{
            if (col.owner==null){
                col.owner = player;
                best = Math.min(best, minimax(board, depth + 1, true));
                col.owner = null;
            }
        }))
        return best;
    }
}
 

function findBestMove(board){
    let bestVal = -Infinity;
    let bestMove = null;
    board.forEach(row=>row.forEach(col=>{
        if (col.owner == null){
            col.owner = opponent;
            let moveVal = minimax(board, 0, false);
            col.owner = null;
            if (moveVal > bestVal){
                bestMove = col;
                bestVal = moveVal;
            }
        }
    }))
    return bestMove;
}
 


 

 