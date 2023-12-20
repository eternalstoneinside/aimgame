// Ваш JavaScript-код

// Проверяем, есть ли сохраненный никнейм в локальном хранилище
const savedNickname = localStorage.getItem('nickname');

// Если никнейм сохранен, отображаем приветственное сообщение
if (savedNickname) {
   const welcomeMessage = document.getElementById('welcomeMessage');
   welcomeMessage.innerHTML = `Welcome, ${savedNickname}!`;
}

// Добавьте следующий код для сохранения никнейма при вводе и нажатии кнопки
const nicknameInput = document.getElementById('nickname');
const saveNicknameBtn = document.getElementById('saveNickname');

saveNicknameBtn.addEventListener('click', () => {
   const enteredNickname = nicknameInput.value.trim();

   if (enteredNickname !== '') {
      localStorage.setItem('nickname', enteredNickname);
      welcomeMessage.innerHTML = `Welcome, ${enteredNickname}!`;
   }
});