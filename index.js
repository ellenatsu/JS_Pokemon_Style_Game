const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

//collision
let collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

let battleZoneMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZoneMap.push(battleZonesData.slice(i, i + 70));
}

const boundaries = [];
const battleZones = [];
const offset = {
  x: -780,
  y: -600,
};
collisionsMap.forEach((row, i) => {
  row.forEach((col, j) => {
    if (col === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * 48 + offset.x,
            y: i * 48 + offset.y,
          },
        })
      );
    }
  });
});

battleZoneMap.forEach((row, i) => {
  row.forEach((col, j) => {
    if (col === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * 48 + offset.x,
            y: i * 48 + offset.y,
          },
        })
      );
    }
  });
});

const image = new Image();
image.src = "./img/Pellet Town.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foreground.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

let background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

let foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

//canvas.height / 2 - 68 / 2
const player = new Sprite({
  position: {
    x: canvas.width / 2 - (192 * 3) / 8,
    y: canvas.height / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const keys = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

let lastKey = "";

const movables = [background, foreground, ...boundaries, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height / 2 &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function playerMove(addX, addY, moving) {
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x + addX,
            y: boundary.position.y + addY,
          },
        },
      })
    ) {
      moving = false;
      break;
    }
  }
  //console.log(moving);
  if (moving) {
    movables.forEach((movable) => {
      movable.position.x += addX;
      movable.position.y += addY;
    });
  }
}

function startBattle(battle, animationId) {
  for (let i = 0; i < battleZones.length; i++) {
    const battleZone = battleZones[i];
    const overlappingArea = calculateArea(
      player.position.x,
      player.width,
      player.position.y,
      player.height,
      battleZone.position.x,
      battleZone.width,
      battleZone.position.y,
      battleZone.height
    );
    if (
      rectangularCollision({ player, battleZone }) &&
      overlappingArea > (player.width * player.height) / 2 &&
      Math.random() < 0.01
    ) {
      console.log("activate battle!");
      window.cancelAnimationFrame(animationId);
      battle.initiated = true;
      gsap.to("#overlappingDiv", {
        opacity: 1,
        repeat: 2,
        yoyo: true,
        duration: 0.4,
        onComplete() {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            duration: 0.4,
            onComplete() {
              animateBattle();
              gsap.to("#overlappingDiv", {
                opacity: 0,
                duration: 0.4,
              });
            },
          });
        },
      });
    }
  }
}
function calculateArea(
  playerX,
  playerWidth,
  playerY,
  playerHeight,
  zoneX,
  ZoneWidth,
  zoneY,
  zoneHeight
) {
  let width =
    Math.min(playerX + playerWidth, zoneX + ZoneWidth) -
    Math.min(playerX, zoneX);
  let height =
    Math.min(playerY + playerHeight, zoneY + zoneHeight) -
    Math.max(playerY, zoneY);
  return width * height;
}

function drawGame() {
  background.draw();
  boundaries.forEach((boundary) => boundary.draw());
  battleZones.forEach((boundary) => boundary.draw());
  player.draw();
  foreground.draw();
}

const battle = {
  initiated: false,
};

function animate() {
  let moving = true;
  player.animate = false;

  const animationId = window.requestAnimationFrame(animate);

  drawGame();

  //judge if enter battle
  if (battle.initiated) return;
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    startBattle(battle, animationId);
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    playerMove(0, 3, moving);
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    playerMove(3, 0, moving);
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    playerMove(0, -3, moving);
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    playerMove(-3, 0, moving);
  }
}

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = "./img/draggleSprite.png";
const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
});

const embyImage = new Image();
embyImage.src = "./img/embySprite.png";
const emby = new Sprite({
  position: {
    x: 280,
    y: 325,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;

    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
