

/****************************************************/
/*                  global vars                     */
/****************************************************/

    /* getting datas from html and css */

let start = document.getElementById("start");     //-----------------------------
let restart = document.getElementById("restart"); //    buttons of the menu
let home = document.getElementById("home");       //-----------------------------    
let menu = document.getElementById("menu");       //    div menu - contains the buttons
let title = document.getElementById("title");     //    "menu"
let zombie = document.getElementById("zombie");   //    little animated zombie


    /* set up canvas */

let cvs = document.getElementById("canvas");

    /* object for the game limits  */
let screen = {
    widthMin: 0,
    widthMax: 0,
    heightMin: 0,
    heightMax: 0,
}

    /* setting var for the game to work */

/* ball part */

let frame; // need to change that - unclear -

/* paddle part */

    /* tools for the menu */

let cpt;
let timer; // contains the setInterval for the starting game countdown
let count = 3;

/****************************************************/
/*                   Functions                      */
/****************************************************/


    /*********************************************/
    /* Create the design of the game on the page */
    /*    Set the ball position in the screen    */
    /*********************************************/


function createBoard(){
    /* Get the navigator size */
    let x = parseInt(window.innerWidth);
    let y = parseInt(window.innerHeight);
    
    /* using the size of the navigator to determine the size of the board for the game */
    x /= 1.5;
    y /= 1.5;
    
    /** saving the size of the board to use it for collisions
        between th e wall and the ball **/
    screen.widthMax = parseInt(x);
    screen.heightMax = parseInt(y);
    
    /* places the ball at the center bottom of th screen */
    /* Implement the size to design the page */
    let board = document.getElementById("board");
    board.style.width = `${x}px`;
    board.style.height = `${y}px`;
    board.style.border = "2px solid white";
    cvs.width = x;
    cvs.height = y;
}

    /****************************************************/
    /* Controling the diffrent stats of the game:       */
    /*          start/lose/go to menu                   */
    /*    you need to reset some variables like         */
    /*  the ball position or the display of the menu    */
    /****************************************************/





function goMenu(){
    document.location.reload();
}


    /****************************************************/
    /* controls the ball movements/change of directions */
    /****************************************************/

/* controle the launch of the game + activate options buttons */
function game(){
    
    /* show canvas */
    cvs.style.display = "block";
}

    /****************************************************/
    /*    Functions to animate the launch of the game   */
    /****************************************************/

function countDown(){
    
    /* The function set the timer and start the game after*/
    cpt = document.getElementById("timer");
    cpt.innerHTML = count--;
    if (count < 0){
        /* hide the timer */
        cpt.style.display = "none";
        /* start the game*/
        game();
        zombie.style.display = "block";
        /* stop the countdown*/
        clearInterval(timer);
    }
}

function launchGame(){
    
    /* cancel menu display */
    
    let startBtn = document.getElementById("start");
    startBtn.style.display = "none";
    title.style.display = "none";
    zombie.style.display = "none";
    menu.style.display = "none";
    /* Set and start the timer */
    timer = setInterval(countDown, 1000);
}

function startGame(){
    launchGame();
}

/****************************************************/
/*               Funny little zombie                */
/****************************************************/

    /****************************************************/
    /*         old video games sprites mecanism         */
    /****************************************************/


let zFrame = 0;

function animateZombie(){
    let x = -100 * zFrame++;
    zombie.style.backgroundPositionX = `${x}px`; //chaage the position of the image
    if (zFrame == 11){
        zFrame = 0;
    }
}

/****************************************************/
/*                    Main code                     */
/****************************************************/


document.addEventListener("DOMContentLoaded",function(){
    createBoard(); // set the black part of the screen depending on your screen size
    frame = setInterval(animateZombie, 200);
    start.addEventListener('click', startGame); // start the game
    home.addEventListener('click', goMenu);
    console.log(document.querySelectorAll('p'));
});