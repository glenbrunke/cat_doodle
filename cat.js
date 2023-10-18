// cat.js is a simple javascript "doodle" that simulates a cat
// swatting a mouse that runs across the table. A mouse can 
// be introduced to the scene with a user click or mobile touch
// on the HTML Canvas

//class Mouse - this object moves across the screen from right to 
// left. Once the mouse encounters the location of the cat's paw,
// it is killed and a blood smear sequence is initated.
class Mouse {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.width = 98;
        this.height = 38;
        this.mouseImage = new Image();
        this.mouseImage.src = "/java_script/cat_doodle/mouse.png";
        this.dead = false;
        this.catPawLocation = 60;

        this.squishSound = new Audio('/java_script/cat_doodle/squish-sound.mp3')
        this.squishPlayed = false;
        
        this.bloodImage = new Image();
        this.bloodImage.src = "/java_script/cat_doodle/blood.png";  
        this.blood = false;
        this.bloodCounter = 0;
        this.bloodMax = 15;
        this.imageAlpha = 1;
    }
 
 // draw() method - updates the image of the mouse depending on its state: squished or dead   
    draw(ctx) {
        if (this.blood == false) {
            ctx.drawImage(this.mouseImage,this.x, this.y, this.width, this.height);            
        }
        else {
            if (this.squishPlayed == false) {
                this.squish();
                this.squishPlayed = true;
            }
            this.imageAlpha = (this.bloodMax - this.bloodCounter)/this.bloodMax;
            ctx.globalAlpha = this.imageAlpha;
            ctx.drawImage(this.bloodImage,this.x, this.y-10, 69, 84);
            ctx.globalAlpha = 1;
            if (this.bloodCounter < this.bloodMax) {
                this.bloodCounter += 1;
            }
            else {
                this.dead = true;
            }
        }
        
    }
    //moveMe() method - updates the x location of the mouse object, stops at the cat's paw location
    moveMe(){
        this.x -= this.speed;
        if (this.x < this.catPawLocation) {
            this.blood = true;
            this.x = this.catPawLocation;
        }
    }
    //squish() method - plays the squish sound
    squish() {
        this.squishSound.loop = false;
        this.squishSound.play();         
    }
}

//class Cat controls the Cat object which is made up of a series of movements
// and sounds depending on the current application state. 
// The Cat can wiggle his tail and swat at the mouse with his paw. In addition
// to movement, the Cat can make a meow sound.
class Cat {
    constructor(){
        this.catHeadImage = new Image();
        this.catHeadImage.src = "/java_script/cat_doodle/cat_head.png";
        this.catPawImage = new Image();
        this.catPawImage.src = "/java_script/cat_doodle/cat_paw.png";
        this.catTailImage = new Image();
        this.catTailImage.src = "/java_script/cat_doodle/cat_tail.png";

        this.meowSound = new Audio('/java_script/cat_doodle/cat-meow.wav');
        this.meowPlayed = false;
        
        this.tailX = 270;
        this.tailXRStop = 280;
        this.tailXLStop = 260;
        this.tailY = 114;
        this.tailDirection = "STOP";
        this.tailSpeed = 3;
        this.tailRounds = 0;
        
        this.pawX = 70;
        this.pawY = 260;
        this.pawWidth = 54;
        this.pawHeight = 45;
        
        this.mouseZone = 80;
        this.attackSequence = false;
        this.attackDirection = "DOWN";  //controls the direction of the paw movement, UP, DOWN, WAIT, or STOP
        this.attackSpeed = 15; // the speed the paw moves when it attacks the mouse object
        this.attackWait = 0;
        this.attackWaitMax = 5;
        this.lastClickTimeStamp = 0; // a counter to prevent the user from spawning too many mouse objects at once. 

    }
 //draw() method - updates the graphics depending on the application state   
    draw(ctx){
        ctx.drawImage(this.catTailImage, this.tailX, this.tailY, 65, 145);
        ctx.drawImage(this.catHeadImage, 110, 138, 173, 121);
        
        this.wiggleTailSequence(); // cat is always wiggling it's tail
        
        //the paw is only shown on an attack sequence
        if (this.attackSequence == true) {
            ctx.drawImage(this.catPawImage, this.pawX, this.pawY, this.pawWidth, this.pawHeight);
            if (this.attackDirection == "DOWN") {
                this.pawY += this.attackSpeed;               
            }
            else {
                this.pawY -= this.attackSpeed;
                if (this.meowPlayed == false) { 
                    this.meow();
                    this.meowPlayed = true;
                }
            }

            if (this.pawY > 260) {
                this.pawY = 260;
                this.attackDirection = "UP";
                this.attackSpeed = 2;
            }
            
            if (this.pawY < 220) {
                this.pawY = 220;
                this.attackDirection = "WAIT"; 
            }
        }
        if (this.attackDirection == "WAIT") {
            if (this.attackWait < this.attackWaitMax) {
                this.attackWait += 1;
            }
            else {
                this.attackSequence = false;
                this.attackWait = 0;
                this.attackDirection = "DOWN";
                this.attackSpeed = 15;
            }
        }
    }

// startAttackSequence() method - resets paw controls to begin a new
// attack sequence.
    startAttackSequence(){
        this.attackSequence = true;
        this.pawY = 220;
        this.attackDirection = "DOWN";
        this.meowPlayed = false;
    }
    
// wiggleTailSequence() method - moves the tail image left and right. Stops moving the tail for 100 frames
// to mimic real cat behavior after moving it back and forth for the number of 'tailRounds'.
    wiggleTailSequence() {
    
        if (this.tailDirection == "WAIT") {
            this.tailRounds -= 1;
            if (this.tailRounds < 0) {
                this.tailDirection = "STOP";
            }
        }
    
        if (this.tailDirection == "STOP") {
            this.tailDirection = "LEFT";
        }
        else if (this.tailDirection == "LEFT") {
            this.tailX -= this.tailSpeed;
            this.tailRounds += 1;
        }
        else if (this.tailDirection == "RIGHT") {
            this.tailX += this.tailSpeed;
            this.tailRounds += 1;
        }
        
        if (this.tailX > this.tailXRStop) {
            this.tailDirection = "LEFT";
        }
        else if (this.tailX < this.tailXLStop) {
            this.tailDirection = "RIGHT";
        }
        
        if (this.tailRounds > 100) {
            this.tailDirection = "WAIT";
        }

    }
    
//meow() method - plays the meow sound
    meow() {
        this.meowSound.loop = false;
        this.meowSound.play();         
    }

}
////////////////////////////////////////////////////////////////////////////////////
// Main program variables and resources
///////////////////////////////////////////////////////////////////////////////////

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "/java_script/cat_doodle/table.png";

const myCat = new Cat(); // only  one cat per application

let mouseArray = []; // program can handle as many mice as needed with the array


// every time the user clicks the screen, add a mouse. Limited to 1 mouse every 3 seconds
canvas.addEventListener('click', (event) => {


    let clickTime = new Date().getTime();
    let timeSinceClick = clickTime;
    timeSinceClick -= myCat.lastClickTimeStamp;
    if (timeSinceClick < 3000) {
        //do nothing.
    }
    else {
        mouseArray.push(new Mouse(370,270));
        myCat.lastClickTimeStamp = clickTime;
    }
});

///////////////////////////////////////////////////////////////////////////////////////
//function updateAnimation() - main program logic sequence to manage objects and animation 
function updateAnimation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the previous animation frame
    ctx.drawImage(backgroundImage, 0, 0, 350, 450); // table and kitchen background scene.

    let mouseIndex = 0;
    mouseArray.forEach(Mouse => { // loop through every mouse on the screen and update their location on the screen
        Mouse.moveMe();
        Mouse.draw(ctx);
        if (Mouse.x < myCat.mouseZone && myCat.attackSequence == false) {
            myCat.startAttackSequence(); // if the mouse has reached the cat, start the attack animation
        }
        if (Mouse.dead == true) { //any dead mice are removed from the object array
            mouseArray.splice(mouseIndex,1);
            mouseIndex -= 1;
        }
        mouseIndex += 1;
    });
    
     myCat.draw(ctx); //drawing the cat last to ensure the paw is on top of the mouse or blood splatter.
}

setInterval(updateAnimation, 50); //calls animation loop every 50ms 