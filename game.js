
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Görselleri yükle
const backgroundImg = new Image();
backgroundImg.src = "assets/background.jpeg";

const playerImg = new Image();
playerImg.src = "assets/olcayto.png";

const semosImg = new Image();
semosImg.src = "assets/semahat.png";

const cakeImg = new Image();
cakeImg.src = "assets/cake.png";

// Oyuncu (kafa) konumu
let player = {
  x: canvas.width / 2 - 40,
  y: 20,
  width: 80,
  height: 80
};

// Semoş karakteri (aşağıda)
const semos = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 100,
  width: 80,
  height: 80
};

let cakes = [];
let score = 0;
const maxScore = 5;

// ⏱️ Kafa 2 saniyede bir yer değiştiriyor
setInterval(() => {
  const minX = 40;
  const maxX = canvas.width - player.width - 40;
  player.x = Math.floor(Math.random() * (maxX - minX) + minX);
}, 2000);

// 🎂 2 saniyede bir otomatik pasta atılıyor
setInterval(() => {
  cakes.push({
    x: player.x + player.width / 2 - 25,
    y: player.y + player.height,
    width: 50,
    height: 50,
    speed: 6
  });
}, 2000);

// Klavye ile semos'u kontrol et (← →)
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    semos.x -= 30;
    if (semos.x < 0) semos.x = 0;
  }
  if (e.code === "ArrowRight") {
    semos.x += 30;
    if (semos.x + semos.width > canvas.width) {
      semos.x = canvas.width - semos.width;
    }
  }
});

function update() {
  // Arka plan
  if (backgroundImg.complete) {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Karakterleri çiz
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  ctx.drawImage(semosImg, semos.x, semos.y, semos.width, semos.height);

  // Pastaları güncelle
  for (let i = 0; i < cakes.length; i++) {
    const c = cakes[i];
    c.y += c.speed;
    ctx.drawImage(cakeImg, c.x, c.y, c.width, c.height);

    // Çarpışma kontrolü
    if (
      c.x < semos.x + semos.width &&
      c.x + c.width > semos.x &&
      c.y < semos.y + semos.height &&
      c.y + c.height > semos.y
    ) {
      cakes.splice(i, 1);
      score++;
      i--;
      if (score >= maxScore) {
        document.getElementById("message").style.display = "block";
        cancelAnimationFrame(gameLoop);
        return;
      }
    }

    // Aşağı düşenleri temizle
    if (c.y > canvas.height) {
      cakes.splice(i, 1);
      i--;
    }
  }
}

// Oyun döngüsü
function loop() {
  update();
  gameLoop = requestAnimationFrame(loop);
}

let gameLoop = requestAnimationFrame(loop);
