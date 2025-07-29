// JavaScript file akan dilengkapi
let score = 0, level = 1, playerName = "", balonCount = 5, maxLevel = 10;
let timerInterval, startTime;

function mulaiGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Isi namanya dulu bro!");

  document.getElementById("form-nama").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("in-game-settings").style.display = "block";

  score = 0; level = 1; balonCount = 5;
  updateScore(); updateLevel();
  startTimer();
  nextLevel();
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const diff = Date.now() - startTime;
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / 60000);
    document.getElementById("timer").innerText =
      `Waktu: ${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }, 500);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function nextLevel() {
  clearBalons();
  generateBalons(balonCount);
  setTimeout(() => {
    if (level < maxLevel) {
      level++; balonCount += 2;
      updateLevel();
      nextLevel();
    } else {
      gameOver();
    }
  }, 7000);
}

function clearBalons() {
  document.querySelectorAll('.balon').forEach(b => b.remove());
}

function generateBalons(count) {
  const gameArea = document.getElementById("game-container");
  const boomIndex = Math.floor(Math.random() * count);
  const colors = ["red", "blue", "green", "orange", "purple", "yellow"];

  for (let i = 0; i < count; i++) {
    const balon = document.createElement("div");
    balon.className = "balon";
    balon.style.background = colors[Math.floor(Math.random() * colors.length)];
    setBalonPosition(balon);

    if (i === boomIndex) {
      balon.dataset.boom = "true";
    }

    balon.onclick = () => {
      if (balon.dataset.boom === "true") {
        playBoomSound();
        alert("💥 Kena BOM! Game Over!");
        gameOver();
        return;
      }
      score++; updateScore(); balon.remove();
    };

    gameArea.appendChild(balon);
    moveBalonRandom(balon);
  }
}

function setBalonPosition(balon) {
  balon.style.left = Math.random() * (document.getElementById("game-container").clientWidth - balon.offsetWidth) + "px";
  balon.style.top  = Math.random() * (document.getElementById("game-container").clientHeight - balon.offsetHeight) + "px";
}

function moveBalonRandom(balon) {
  let speed = 1000 - (level * 80);
  function move() {
    if (!balon.parentElement) return;
    setBalonPosition(balon);
    setTimeout(move, speed);
  }
  move();
}

function updateScore() {
  document.getElementById("score").innerText = "Skor: " + score;
}
function updateLevel() {
  document.getElementById("level").innerText = "Level: " + level;
}

function playBoomSound() {
  const boom = document.getElementById("sound-boom");
  boom.currentTime = 0;
  boom.play();
}

function gameOver() {
  stopTimer();
  document.getElementById("bgm-gameover").play();
  document.getElementById("in-game-settings").style.display = "none";

  fetch("save_score.php", {
    method: "POST",
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: `name=${encodeURIComponent(playerName)}&score=${score}`
  }).then(getLeaderboard);
}

function getLeaderboard() {
  fetch("get_leaderboard.php")
    .then(res => res.json())
    .then(data => {
      const board = document.getElementById("leaderboard");
      board.innerHTML = "";
      data.forEach(entry => {
        const li = document.createElement("li");
        li.innerText = `${entry.name}: ${entry.score}`;
        board.appendChild(li);
      });
      if (data[0]) {
        document.getElementById("highscore").innerText =
          `High Score: ${data[0].score} (oleh ${data[0].name})`;
      }
    });
}

function toggleLevelInfo() {
  const info = document.getElementById("level-info");
  info.style.display = info.style.display === "none" ? "block" : "none";
}

function backToHome() {
  clearGame();
  document.getElementById("form-nama").style.display = "block";
  document.getElementById("game").style.display = "none";
  document.getElementById("in-game-settings").style.display = "none";
  document.getElementById("game-container").innerHTML = "";
}

function restartGame() {
  clearGame();
  mulaiGame();
}

function clearGame() {
  clearInterval(timerInterval);
  score = 0;
  level = 1;
  updateScore();
  updateLevel();
  document.getElementById("timer").innerText = "Waktu: 00:00";
  document.getElementById("game-container").innerHTML = "";
}

window.onload = getLeaderboard;
