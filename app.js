document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const mgrid = document.querySelector('.mini-grid');
    
    // create divs for grid...
    let divs = '';
    for(i=0; i < 200; i++){
        divs += '<div></div>';
    }
    for(i=0; i<10; i++) {
        divs += '<div class="taken"></div>';
    }
    grid.insertAdjacentHTML('afterbegin', divs);

    // create divs for mini-grid
    divs = '';
    for(i=0; i < 16; i++) {
        divs += '<div></div>';
    }
    mgrid.insertAdjacentHTML('afterbegin',divs);


    let squares = Array.from(document.querySelectorAll('.grid div'));
   
    
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button'); 
    let nextRandom = 0;
    const miniWidth = 4;
    const speed = 500;
    let timerId = null; 
    let score = 0;

    scoreDisplay.innerHTML = score;

    // tetrominoes ??
    const ltetrom = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]; 

    const ztetrom = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]; 

    const ttetrom = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const otetrom = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]        
    ];

    const itetrom = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const tetrominoes = [ltetrom,ztetrom,ttetrom,otetrom,itetrom]; 

    const upnextTetro = [
        [1, miniWidth+1, miniWidth*2+1, 2],             // L - 0
        [0,miniWidth,miniWidth+1,miniWidth*2+1],        // Z - 1
        [1,miniWidth,miniWidth+1,miniWidth+2],          // T - 2 
        [0,1,miniWidth,miniWidth+1],                    // O - 3
        [1,miniWidth+1,miniWidth*2+1,miniWidth*3+1],    // I - 4
    ];

    const colors = ['orange','red','purple','green','blue'];


    let currPos = 4;
    let currRot = 0;
    
    // randomize the tetromino drawn:
    let random = Math.floor(Math.random() * tetrominoes.length);
    //let random = 0; 
    let current = tetrominoes[random][currRot];

    // console.log('upnext array:', upnextTetro);
    // console.log('init/current:', current);
    // console.log('init/random:', random);
    // console.log('init/nextRandom', nextRandom); 

    
    function draw() {
        current.forEach(index => {
            squares[currPos + index].classList.add('tetromino');
            squares[currPos + index].style.backgroundColor = colors[random];
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currPos + index].classList.remove('tetromino');
            squares[currPos + index].style.backgroundColor = '';
        })
    }
   
    function moveDown() {
        undraw();
        currPos += width;
        draw();
        freeze();
    }

    function freeze() {

        if (current.some(index => squares[currPos + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currPos + index].classList.add('taken'));
            // start new tetromino
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currRot];

            // console.log('new/random:', random);
            // console.log('new/nextRandom', nextRandom); 
            // console.log('new/current:', current);

            currPos = 4;
            draw();
            nextShape();
            addScore();
            gameOver();
        }
    }

    function movLeft() {
        undraw();
        const atLeft = current.some(index => (currPos + index) % width === 0)

        if(!atLeft) currPos -=1

        if(current.some(index => squares[currPos + index].classList.contains('taken'))) {
            currPos += 1;
        }

        draw();
    }

    function movRight() {
        undraw()
        const atRight = current.some(index => (currPos + index) % width === width - 1)

        if(!atRight) currPos +=1

        if(current.some(index => squares[currPos + index].classList.contains('taken'))) {
            currPos -= 1;
        }

        draw();
    }
    
    function getKey(e) {
        if(e.keyCode === 37) movLeft();
        if(e.keyCode === 39) movRight();
        if(e.keyCode === 40) keyDown();
        if(e.keyCode === 38) rotate();
    }

    document.addEventListener('keyup', getKey);


    function rotate() {
        undraw();
        currRot ++;
        if(currRot === current.length) {
            currRot = 0;
        }
        current = tetrominoes[random][currRot]
        draw();
    }
     

    // show the next shape in mini-grid
    const minigrid = document.querySelectorAll('.mini-grid div');
    let miniIndex = 0;

    
    function nextShape() {
        minigrid.forEach(square => {
            square.classList.remove('tetromino');
        })
  
        upnextTetro[nextRandom].forEach(index => {
            minigrid[miniIndex + index].classList.add('tetromino');
        })
    }
 
    startBtn.addEventListener('click', () => {

        if(timerId) {
            clearInterval(timerId);
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, speed); 
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            nextShape();
        }

    })

    function addScore() {
        for ( let i = 0; i < 199; i += width ) {
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
            
            // check current row for 'taken' class
            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 100;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                })
                const sqRemoved = squares.splice(i, width);
                squares = sqRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell)); 
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currPos + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'GAME OVER';
            clearInterval(timerId);
        }
    }










})