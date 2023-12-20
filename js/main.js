const startBtn = document.querySelector("#start"),
   screens = document.querySelectorAll(".screen"),
   timeList = document.querySelector("#time-list"),
   difficultyList = document.querySelector("#difficulty-list"),
   timeEl = document.querySelector("#time"),
   board = document.querySelector("#board"),
   hitsEl = document.querySelector("#hits"),
   accuracyEl = document.querySelector("#accuracy"),
   hitsOver = document.querySelector("#hits-over"),
   accuracyOver = document.querySelector("#accuracy-over"),
   hearts = document.querySelectorAll(".heart"),
   restartBtns = document.querySelectorAll(".btn-restart"),
   fullScreenBtn = document.querySelector("#fullscreen"),
   minimizeBtn = document.querySelector("#minimize"),
   backMenuBtn = document.querySelector(".btn-start-screen"),
   hitSound = document.getElementById("hitSound"),
   missSound = document.getElementById("missSound"),
   overlayTimer = document.getElementById("overlayTimer");

let time = 0,
   unlimited = false,
   difficulty = 0,
   playing = false,
   hits = 0,
   missed = 0,
   accuracy = 0,
   interval;

startBtn.addEventListener("click", () => {

   screens[0].classList.add("up");

});

timeList.addEventListener("click", (e) => {
   if (e.target.classList.contains("time-btn")) {
      time = parseInt(e.target.getAttribute("data-time"));
      unlimited = e.target.getAttribute("data-unlimited");
      screens[1].classList.add("up")
   }
});

difficultyList.addEventListener("click", (e) => {
   if (e.target.classList.contains("difficulty-btn")) {
      difficulty = parseInt(e.target.getAttribute("data-difficulty"));
      screens[2].classList.add("up");

      document.body.style.pointerEvents = "none";

      overlayTimer.style.display = "flex";

      // Запускаем таймер на 3 секунды
      let countdown = 3;
      overlayTimer.innerHTML = countdown;

      const countdownInterval = setInterval(() => {
         countdown--;

         if (countdown >= 0) {
            overlayTimer.innerHTML = countdown;
         } else {
            // Скрываем таймер, разблокируем взаимодействие и запускаем игру
            overlayTimer.style.display = "none";
            clearInterval(countdownInterval);
            document.body.style.pointerEvents = "auto";
            startGame();
         }
      }, 1000);
   }
});

function startGame() {
   playing = true;
   interval = setInterval(decreaseTime, 1000);
   createRandomCircle();
}
function decreaseTime() {
   if (unlimited) {
      //iff unlimiter selected
      setTime("&#8734;")
      return;
   }
   if (time == 0) {
      //game over
      finishGame();
   }
   let current = --time;
   let miliseconds = time * 1000;

   let minutes = Math.floor(miliseconds / (1000 * 60));
   let seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);

   seconds = seconds < 10 ? '0' + seconds : seconds;
   minutes = minutes < 10 ? '0' + minutes : minutes;

   setTime(`${minutes}:${seconds}`);
}


function setTime(time) {
   timeEl.innerHTML = time;
}

function createRandomCircle() {
   if (!playing) {
      return;
   }

   const circle = document.createElement("div");
   const size = getRandomNumber(30, 100);
   // const colors = ["#29cef7"];
   const { width, height } = board.getBoundingClientRect();
   const x = getRandomNumber(0, width - size);
   const y = getRandomNumber(0, height - size);
   circle.classList.add("circle");
   circle.style.width = `${size}px`;
   circle.style.height = `${size}px`;
   circle.style.top = `${y}px`;
   circle.style.left = `${x}px`;

   // let color = Math.floor(Math.random() * 5);
   // circle.style.background = `${colors[color]}`;
   board.append(circle);

   if (difficulty == 1) {
      circle.style.animationDuration = '2s';
   } else if (difficulty == 2) {
      circle.style.animationDuration = '1s';
   } else {
      circle.style.animationDuration = '3s';
   }

   circle.addEventListener('animationend', () => {
      setTimeout(() => {
         circle.remove();
         createRandomCircle();
         playMissSound();
         addMissed();
         calculateAccuracy();
         createMissTrail(x + size / 2, y + size / 2);
      }, 100); // Уменьшили задержку перед появлением нового кружка
   });

}


board.addEventListener("click", (e) => {
   const x = e.clientX - board.getBoundingClientRect().left;
   const y = e.clientY - board.getBoundingClientRect().top;

   if (e.target.classList.contains("circle")) {
      hits++;
      e.target.remove();
      createRandomCircle();
      playHitSound();
   } else {
      missed++;
      playMissSound();
      createMissTrail(x, y);
   }

   hitsEl.innerHTML = hits;
   calculateAccuracy();
});

function playHitSound() {
   hitSound.currentTime = 0; // Устанавливаем currentTime в 0 для повторного воспроизведения
   hitSound.play();
}

function playMissSound() {
   missSound.currentTime = 0;
   missSound.play();
}

function finishGame() {
   playing = false;
   clearInterval(interval);
   overlayTimer.style.pointerEvents = "auto";
   board.innerHTML = '';
   screens[3].classList.add("up");
   hitsEl.innerHTML = 0;
   timeEl.innerHTML = "00:00";
   accuracy.innerHTML = "0%";

   hitsOver.innerHTML = hits;
   accuracyOver.innerHTML = `${accuracy}%`;

}


function calculateAccuracy() {
   if (hits + missed === 0) {
      accuracy = 100;
   } else {
      accuracy = Math.round((hits / (hits + missed)) * 100);
   }
   accuracyEl.innerHTML = `${accuracy}%`;
}

function addMissed() {
   if (isHeartModeEnabled) {
      // Найдем первое неживое сердце (без класса "dead")
      const liveHeart = Array.from(hearts).find((heart) => !heart.classList.contains("dead"));

      if (!liveHeart) {
         finishGame();
      } else {
         missed++;
         liveHeart.classList.add("dead");
      }
   }
}

function getRandomNumber(min, max) {
   return Math.round(Math.random() * (max - min) + min)
}


restartBtns.forEach((btn) => {
   btn.addEventListener("click", restartGame)
});

function restartGame() {
   finishGame();
   hearts.forEach((heart) => {
      heart.classList.remove("dead");
   });
   screens[1].classList.remove("up");
   screens[2].classList.remove("up");
   screens[3].classList.remove("up");
   time = 0;
   difficulty = 0;
   hits = 0;
   missed = 0;
   accuracy = 0;
   playing = false;
   unlimited = false;
   accuracyEl.innerHTML = "100%";
}


fullScreenBtn.addEventListener("click", fullScreen);

let elem = document.documentElement;

function fullScreen() {
   if (elem.requestFullscreen) {
      elem.requestFullscreen();
   } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
   } else if (elem.webkitRequstFullscreen) {
      elem.webkitRequstFullscreen();
   } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
   }

   fullScreenBtn.style.display = 'none';
   minimizeBtn.style.display = 'block';

}

minimizeBtn.addEventListener("click", minimize);

function minimize() {

   if (document.exitfullscreen) {
      document.exitfullscreen();
   } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
   } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
   } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
   }


   minimizeBtn.style.display = 'none';
   fullScreenBtn.style.display = 'block';
}

backMenuBtn.addEventListener("click", startScreen);


function startScreen() {
   finishGame();
   screens[0].classList.remove("up");
   screens[1].classList.remove("up");
   screens[2].classList.remove("up");
   screens[3].classList.remove("up");
   time = 0;
   difficulty = 0;
   hits = 0;
   missed = 0;
   accuracy = 0;
   playing = false;
   unlimited = false;
   hearts.forEach((heart) => {
      heart.classList.remove("dead");
   });
   // location.reload();
}

const toggleButton = document.getElementById("toggleButton");
let isHeartModeEnabled = true; // Флаг, определяющий, включен ли режим с сердцами

toggleButton.addEventListener("click", toggleHeartMode);

function toggleHeartMode() {
   isHeartModeEnabled = !isHeartModeEnabled;

   // Убрать класс "dead" у всех сердец при включении режима с сердцами
   if (isHeartModeEnabled) {
      hearts.forEach((heart) => {
         heart.classList.remove("dead");
      });
   }

   toggleButton.classList.toggle("off", !isHeartModeEnabled);

   setTimeout(() => {
      const heartBlock = document.getElementById("heartBlock");
      heartBlock.style.display = isHeartModeEnabled ? "flex" : "none";

      if (isHeartModeEnabled) {
         addMissed();
      }
   }, 100);
}



function createMissTrail(x, y) {
   const missTrail = document.createElement("div");
   missTrail.classList.add("miss-trail");
   missTrail.style.top = `${y - 5}px`; // Учтем половину высоты
   missTrail.style.left = `${x - 5}px`; // Учтем половину ширины
   board.append(missTrail);

   const line1 = document.createElement("div");
   line1.classList.add("miss-line");
   missTrail.appendChild(line1);

   const line2 = document.createElement("div");
   line2.classList.add("miss-line");
   missTrail.appendChild(line2);

   // Задаем стили для линий
   line1.style.transform = "rotate(45deg)";
   line2.style.transform = "rotate(-45deg)";

   // Устанавливаем таймер для удаления следа промаха через некоторое время
   setTimeout(() => {
      missTrail.remove();
   }, 1000);
}
