var LINE_WEIGHT = 20;
var LINE_LENGTH = 180;
var LINE_GAP = 360;
var SPEED = 8;
var CAR_SENSITIVITY = 10;
var CRASH = false;
var distance = 0;
var posX = 0;
var posY = 0;
var blur = 0;
var car_player;
var jack, car;
var canvas;
var busyLines = [];
var img_cars = [];

function setup() {
  init();
  canvas = createCanvas(550, 720);
  stroke(255);
  frameRate(60);

  img_cars[0] = "https://i.imgur.com/TRRzLDB.png";
  img_cars[1] = "https://i.imgur.com/75pHzjv.png";
  img_cars[2] = "https://i.imgur.com/gm6CT0E.png";

  car_player = new Car(width/2 - 220/4, height - 440/2 - 50, 220/2, 440/2, "https://i.imgur.com/Y3jJEkM.png");
  jack  = new Jack(50,-50,50,150,"https://i.imgur.com/5dEwnkw.png");
  car = new Car(50, -500, 220/2, 440/2, getRandomCarImage());
}

function draw() {
  background(30);
  play();
  distance = distance + SPEED;
}

function init() {
  LINE_WEIGHT = 20;
  LINE_LENGTH = 180;
  LINE_GAP = 360;
  SPEED = 8;
  CAR_SENSITIVITY = 10;
  CRASH = false;
  distance = 0;
  posX = 0;
  posY = 0;
  blur = 0;
  car_player;
  jack, car;
  canvas;
  busyLines = [];
  img_cars = [];
}

function getRandomCarImage() {
  return img_cars[floor(random(0,img_cars.length))];
}

function play() {
  if(!CRASH) {

    drawLines();

    car_player.move();
    car_player.draw();

    jack.draw();
    jack.move();

    car.draw();
    car.autoMove();


    if(Collision(car_player, car))
      CRASH = true;

    if(Collision(car_player, jack))  {
      var body = window.document.getElementsByTagName('body')[0];
      blur = blur + 2;
      SPEED = SPEED + 2;
      CAR_SENSITIVITY = CAR_SENSITIVITY + 1;
      body.style.filter = "blur(" + blur + "px)";
      jack.show = false;
    }

    if(car_player.x + car_player.w > width || car_player.x < 0)
      CRASH = true;
  } else {
    var body = window.document.getElementsByTagName('body')[0];
    body.style.filter = "blur(0px)";
    noStroke();
    fill(230);
    textSize(32)
    text("À ce jeu", 200, 100);
    text("personne ne gagne", 125, 150);
    textSize(16);
    text("Appuyez sur espace pour recommencer", 130, height - 50);

    if(keyIsPressed)
      if(keyIsDown(32)) {
        setup();
      }

  }
}

function drawLines() {
  strokeWeight(LINE_WEIGHT);

  var xGap = width/3;
  posX = xGap - LINE_WEIGHT/2;
  posY = posY + SPEED;

  if(posY >= LINE_GAP)
  posY = 0;

  line(posX, posY - LINE_GAP, posX, posY+LINE_LENGTH - LINE_GAP);
  line(posX + xGap, posY - LINE_GAP, posX + xGap, posY+LINE_LENGTH - LINE_GAP);

  line(posX, posY, posX, posY+LINE_LENGTH);
  line(posX + xGap, posY, posX + xGap, posY+LINE_LENGTH);

  line(posX, posY + LINE_GAP, posX, posY+LINE_LENGTH + LINE_GAP);
  line(posX + xGap, posY + LINE_GAP, posX + xGap, posY+LINE_LENGTH + LINE_GAP);
}

function Car(x,y,w,h,imgPath) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y;
  this.img = loadImage(imgPath);
  this.show = true;

  this.move = function() {
    if(keyIsPressed) {
      if(keyIsDown(LEFT_ARROW))
      this.x = this.x - CAR_SENSITIVITY;
      else if(keyIsDown(RIGHT_ARROW))
      this.x = this.x + CAR_SENSITIVITY;
    }
  }

  this.draw = function() {
    if(this.show)
    image(this.img, this.x, this.y, this.w, this.h);
    else
    this.respawn();
  }

  this.respawn = function() {
    var gapX = width/6;
    var rand = random(0,3);
    if(rand < 1)
      this.x = gapX - this.w/2;
    else if(rand > 1 && rand < 2)
      this.x = gapX*3 - this.w/2;
    else if(rand > 2)
      this.x = gapX*5 - this.w/2;

    this.y = random(-500,-250);

    this.img = loadImage(getRandomCarImage());

    this.toString();
    this.show = true;
  }

  this.autoMove = function() {
    this.y = this.y + SPEED/3;
    if(this.y > height) {
      this.show = false;
    }
  }

  this.toString = function() {
    print("x = " + this.x);
    print("y = " + this.y);
    print("w = " + this.w);
    print("h = " + this.h);
  }
}

function Jack(x,y,w,h,imgPath) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y;
  this.img = loadImage(imgPath);
  this.show = true;

  this.draw = function() {
    if(this.show)
    image(this.img, this.x, this.y, this.w, this.h);
  }

  this.move = function() {
    if(this.y > height)
    this.show = false;
    if(!this.show) {
      this.respawn();
      this.show = true;
    }
    this.y = this.y + SPEED;
  }

  this.respawn = function() {
    var gapX = width/6;
    var rand = random(0,3);
    if(rand < 1)
    this.x = gapX - this.w/2;
    else if(rand > 1 && rand < 2)
    this.x = gapX*3 - this.w/2;
    else if(rand > 2)
    this.x = gapX*5 - this.w/2;
    this.y = -700;
  }
}

function Collision(obj1, obj2) {
  if(obj1.show && obj2.show) {
    if(obj1.x < obj2.x + obj2.w &&
      obj1.x + obj1.w > obj2.x &&
      obj1.y < obj2.y + obj2.h &&
      obj1.h + obj1.y > obj2.y) {
        return true;
      }
    }
    return false;
  }
