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
const battleZone = [];
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
      battleZone.push(
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

const movables = [background, foreground, ...boundaries, ...battleZone];

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

function animate() {
  let moving = true;
  window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => boundary.draw());
  battleZone.forEach((boundary) => boundary.draw());
  player.draw();
  foreground.draw();

  player.moving = false;
  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
    playerMove(0, 3, moving);
  } else if (keys.a.pressed && lastKey === "a") {
    player.moving = true;
    player.image = player.sprites.left;
    playerMove(3, 0, moving);
  } else if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.image = player.sprites.down;
    playerMove(0, -3, moving);
  } else if (keys.d.pressed && lastKey === "d") {
    player.moving = true;
    player.image = player.sprites.right;
    playerMove(-3, 0, moving);
  }
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
