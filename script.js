

var startBlock = document.querySelector("#start"),      // обращаемся к блоку старт
    gameBlock = document.querySelector("#game"),        // блоку игра
    lifes = document.querySelector("#lifes"),           // блоку жизни         
    startBtn = document.querySelector("#start button"), // кнопке старт 
    countLifes = 5,  // назначили переменную отвечающую за количество жизней
    countScore = 0, // назначили счетчик очков за попадание
    gamerSkin= "skin_1";
startBtn.onclick = function () {                    // назначили процедуру по клику на кнопке старт 
    startGame();
};



var soundBtn = document.querySelector("#sound img"),    // обратились к картинке отвечающей за звук
    isSoundOn = "false",                                // назначили стартовое положение тоглера звука
    audioplayer = document.querySelector("audio");      // обратились к элементу страницы содержащей звуковой файл


soundBtn.onclick = function () {        // назначили процедуру клика по кнопке звук 
    if (isSoundOn == "true") {  // если тоглер включен
        soundBtn.src = "images/mute_sound.png"; // назначаем инконку без звука
        isSoundOn = "false";    // меняем тоглер на выключение
        audioplayer.pause();    // запускаем метод пауза в плеере
    } else {        // в остальных случаях
        soundBtn.src = "images/sound_on.png";    // назначаем инконку со звуком 
        isSoundOn = "true"; // меняем тоглер на включение
        audioplayer.play(); // запускаем плеер
    }
};


function startGame() {
    startBlock.style.display = "none";              // блок старта прячем
    gameBlock.style.display = "block";              // блок игры показываем 
    gamer.className = gamerSkin;
    createLifes();  // добавили жизни 
    createEnemy(); //вызов процедуры создания врага 

}

function getRandomIntInclusive(min, max) {      // функция генератора псевдослучайных чисел
    min = Math.ceil(min);                       // минимальное значение  
    max = Math.floor(max);                      // максимальное значение 
    return Math.floor(Math.random() * (max - min + 1)) + min; // генерация случайного числа включительно с максимальным
}


function createEnemy() {   // процедура создания врага
    let enemy = document.createElement("div");      // создали новый блок
    let enemyId = getRandomIntInclusive(1, 2);      // переменная для типажа врага 

    position = getRandomIntInclusive(100, document.querySelector("#app").clientHeight - 200);
    // переменная для определения случайного расположения врага

    enemy.className = "enemy type-" + enemyId; // присвоение случайного класса врага
    enemy.style.top = position + "px"; // случайное расположение врага

    gameBlock.appendChild(enemy); // добавление блока в блок приложения 

    moveEnemy(enemy); // вызов функции движения врага
}

function moveEnemy(enemy) {         // функция движения врага 
    let timerID = setInterval(function () {   // вызываем функцию регулярно  
        enemy.style.left = enemy.offsetLeft - 10 + "px"; //динамически меняем положение левой границы блока с врагом

        if (enemy.offsetLeft < -100) { //если координаты врага вылетели за границу экрана более чем на 100рх
            enemy.remove();                // удаляем блок с врагом 
            createEnemy();                 // создаем его заново
            clearInterval(timerID);         // очищаем таймер

            die();                      // запускаем процедуру по отниманию очков жизни и окончанию игры

        }
    }, 50); // интервал запуска  функции 50мс
}



var gamer = document.querySelector("#player");      // обращаемся к блоку содержащему изображение персонажа

document.onkeydown = function (event) {         // назначаем функцию обработчика событий
    if (event.keyCode == 87) {			// если нажата клавиша с определенным кодом "w"
        if (gamer.offsetTop > 60) {     //и отступ блока с персонажем более 60рх (чтобы не лезть на блок с жизнями)
            gamer.style.top = gamer.offsetTop - 30 + "px";  // положение блока с игроком меняется - идем вверх
        }
    }
    if (event.keyCode == 83) { // если нажата клавиша с определенным кодом "s"

        if (gamer.offsetTop < document.querySelector("#app").clientHeight - 200) {  // и отступ сверху меньше высоты блока приложения минус высота блока персонажа
            gamer.style.top = gamer.offsetTop + 30 + "px"; // положение блока с игроком меняется - идем вниз
        }
    }

    if (event.keyCode == 32) {      //если нажали пробел
        createBullet();  // игрок стреляет вызываем процедуру создания пули
    }
};



function createBullet() {                // процедура создания пули
    bullet = document.createElement("div"); // создали блок
    bullet.className = "bullet";    // присвоили ему стили по классу "пуля"
    bullet.style.top = player.offsetTop + 145 + "px"; // указали  ему верхний отступ на 145рх ниже верхнего отступа блока с главным игроком
    gameBlock.appendChild(bullet); // поместили в блок с игрой 
    moveBullet(bullet); // вызвали функцию движения пули 
}

function moveBullet(bullet) {    // функция движения пули
    var bulletTimer = setInterval(function () { // вызываем функцию регулярно
        bullet.style.left = bullet.offsetLeft + 10 + "px"; // к левому отступу пули добавляем 10рх

        if (bullet.offsetLeft > document.querySelector("body").clientWidth) { // если пуля вылетела за границу экрана
            bullet.remove(); // то удаляем её
            clearInterval(bulletTimer); // очищяем интервал запуска
        }
        isBoom(bullet);     // запускаем процедуру проверки попадания по врагу
    }, 15); // интервал запуска функции

}

// попадание по врагу

function isBoom(bullet) {
    let enemy = document.querySelector(".enemy");   // обратимся к блоку с врагом 

    if (enemy != null  
        && bullet.offsetTop > enemy.offsetTop   // если пуля не ниже блока врага по вертикали
        && bullet.offsetTop < enemy.offsetTop + enemy.clientHeight // не выше блока врага
        && bullet.offsetLeft > enemy.offsetLeft){ // не левее блока врага  
        
        countScore++; // добавляем значение в счетчик очков 
        printScore(); // вызываем процедуру отрисовки очков в окне игры
        bullet.remove();   // пулю удаляем
        enemy.className = "boom"; // врага перерисовывем во вспышку 

        setTimeout (function() {
            enemy.remove();   // врага удаляем
        }, 1000);  // через секунду

        setTimeout (function() {
            createEnemy();     // создаем врага сзаново
        }, 1000);  // через секунду
    }
}

function die() {
    countLifes--;

    if (countLifes <= 0) {
        endGame();
    }
    createLifes();
}

function createLifes() {
    let lifesBlock = document.querySelector("#lifes");
    lifesBlock.innerHTML = "";

    let count = 0;
    while (count < countLifes) {
        let span = document.createElement("span");
        lifesBlock.appendChild(span);
        count++;
    }
}

function printScore() {                 // процедура отрисовки счетчика очков
    score = document.querySelector("#score span");      // обратились к элементу счетчика очков на странице
    score.style.color = "yellow";           // раскрасили текст в желтый
    score.innerHTML = "";                   // очистили ранее стоявший там текст 
    score.innerText = countScore;           // записали значение счетчика 
}


function endGame () {
    let scoreBlock = document.querySelector ("#end h3 span");
    scoreBlock.innerText = countScore;
    scoreBlock.style.color="green";
    
    gameBlock.innerHTML = "";
    let endBlock = document.querySelector("#end");
    endBlock.style.display = "block";

    let restartBtn = document.querySelector("#restart"); 
    restartBtn.onclick = restart;

}

function restart (){
    location.reload();
}

selectSkin1=document.querySelector("#skin_1");
selectSkin2=document.querySelector("#skin_2");

selectSkin1.onclick = function () {
    selectSkin1.className = "selected";
    selectSkin2.className = "";
    gamerSkin = "skin_1";
};
selectSkin2.onclick = function () {
    selectSkin1.className = "";
    selectSkin2.className = "selected";
    gamerSkin = "skin_2";
};


