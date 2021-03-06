/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
let myGamePiece;
const myObstacles = [];
let myScore;

function startGame() {
  myGamePiece = new component(20, 20, 'red', 10, 120);
  myGamePiece.gravity = 0.05;
  myScore = new component('30px', 'Consolas', 'black', 280, 40, 'text');
  myGameArea.start();
}

// eslint-disable-next-line no-var
var myGameArea = {
  canvas: document.createElement('canvas'),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

class component {
  constructor(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
      ctx = myGameArea.context;
      if (this.type === 'text') {
        ctx.font = `${this.width} ${this.height}`;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };
    this.newPos = function () {
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY + this.gravitySpeed;
      this.hitBottom();
    };
    this.hitBottom = function () {
      const rockbottom = myGameArea.canvas.height - this.height;
      if (this.y > rockbottom) {
        this.y = rockbottom;
        this.gravitySpeed = 0;
      }
    };
    this.crashWith = function (otherobj) {
      const myleft = this.x;
      const myright = this.x + this.width;
      const mytop = this.y;
      const mybottom = this.y + this.height;
      const otherleft = otherobj.x;
      const otherright = otherobj.x + otherobj.width;
      const othertop = otherobj.y;
      const otherbottom = otherobj.y + otherobj.height;
      let crash = true;
      if (mybottom < othertop ||
        mytop > otherbottom ||
        myright < otherleft ||
        myleft > otherright) {
        crash = false;
      }
      return crash;
    };
  }
}

function updateGameArea() {
  let x;
  let height;
  let gap;
  let minHeight;
  let maxHeight;
  let minGap;
  let maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo === 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight,
    );
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(10, height, 'green', x, 0));
    myObstacles.push(
      new component(10, x - height - gap, 'green', x, height + gap),
    );
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  myScore.text = `SCORE: ${myGameArea.frameNo}`;
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 === 0) {
    return true;
  }
  return false;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}
