const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./img/Pellet Town.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.image = image;
    this.velocity = velocity;
  }

  draw() {
    ctx.drawImage(this.image, -785, -600);
  }
}

const background = new Sprite({
  position: {
    x: -780,
    y: -600,
  },
  image: image,
});

const keys = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  ctx.drawImage(image, -785, -600);
  ctx.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      break;

    case "a":
      keys.a.pressed = true;
      break;

    case "s":
      keys.s.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
  }
});
