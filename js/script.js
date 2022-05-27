let first = document.querySelector('.first-item'),                          // Получаем первый элемент
    clone = first.cloneNode(true);                                          // Создаём клон
document.querySelector('.slider-line').appendChild(clone);                  // Добавляем в конец коллекции слайдов

const images = document.querySelectorAll('.slider-line img'),               // Получаем коллекцию изображений (объектов)
    sliderLine = document.querySelector('.slider-line'),                    // Получаем коллекцию слайдов (блоков)
    dots = document.querySelectorAll('.slider__dots button');               // Получаем коллекцию точек (объектов)

let index = 0,                                                              // Хранит индекс слайда
    width,                                                                  // Хранит ширину видимой области коллекции слайдов
    shift,                                                                  // Хранит размер сдвига коллекции слайдов в еденицу времени
    numberOfShifts,                                                         // Хранит количество итераций сдвига коллекции слайдов в еденицу времени
    moveSpeedValue,                                                         // Хранит значение функции скорости сдвига коллекции слайдов
    offset = 0,                                                             // Хранит абсолютное смещение коллекции слайдов
    indexActiveDot = 0,                                                     // Хранит индекс активной точки
    animationFlag = false;                                                  // Проверяет, включена ли сейчас анимация

function init() {                                                           // Функция инициализации размеров слайдера
    width = document.querySelector('.slider__image').offsetWidth;           // Получаем ширину видимого слайда
    shift = width / 200;                                                    // Получаем размер сдвига коллекции слайдов в еденицу времени
    sliderLine.style.width = width * images.length + 'px';                  // Устанавливаем ширину коллекцию слайдов
    for (item of images) {                                                  // Для каждого объекта коллекции изображений
        item.style.width = width + 'px';                                    // Устанавливаем ширину изображения, равную ширине видимой области коллекции слайдов
        item.style.height = 'auto';                                         // Устанавливаем высоту изображения, сохраняя пропорции
    };
}

window.addEventListener('resize', init);                                    // При изменении размера окна браузера вызвать функцию инициализации размеров слайдера
init();                                                                     // Вызываем функцию инициализации размеров слайдера сразу после загрузки страницы

function draw(direction) {                                                  // Функция отрисовки анимации
    offset += direction * shift;                                            // Увеличиваем абсолютное смещение коллекции слайдов на размер сдвига в еденицу времени
    sliderLine.style.left = offset + 'px';                                  // Сдвигаем коллекцию
}

function rollSlider(direction) {                                            // Функция плавного перелистывания слайдов
    numberOfShifts = 0;                                                     // Обнуляем счётчик итераций сдвига коллекции слайдов в еденицу времени
    moveSpeedValue = setInterval(function () {                              // Выполнять функцию
        if (numberOfShifts >= 200) {                                        // Если количество итераций сдвига коллекции слайдов достигло 200 то
            clearInterval(moveSpeedValue);                                  // Отменить повторение функции сдвига коллекции
            animationFlag = false;                                          // Анимация завершена
            return;                                                         // Завершить выполнение функции сдвига коллекции
        }
        animationFlag = true;                                               // Анимация запущена
        draw(direction);                                        // Вызывать функцию отрисовки анимации (direction == -1 => след. слайд; direction == 1 => пред. слайд)
        numberOfShifts++;                                                   // Увеличивать счётчик итераций
    }, 5);                                                                  // Каждые 5 мс
}

document.querySelector('.slider__btn_next').addEventListener('click', function () {     // При нажатии на кнопку Next
    if (animationFlag) return false;                                        // Если анимация запущена, то при нажатии ничего не произойдёт
    if (index >= images.length - 1) {                                       // Если показан последний слайд коллекции (клон первого)
        index = 0;                                                          // Обнулить индекс
        offset = 0;                                                         // Обнулить смещение коллекции
    }
    index++;                                                                // Увеличиваем индекс активного слайда
    rollSlider(-1);                                                         // Вызывать функцию плавного перелистывания слайдов влево
    dots[indexActiveDot].classList.remove('active');                        // Удаляем класс active у текущей точки
    if (indexActiveDot == (dots.length - 1)) {                              // Если активна последняя точка
        indexActiveDot = 0;                                                 // Обнулить индекс активной точки
    } else {                                                                // Иначе
        indexActiveDot++;                                                   // Увеличить индекс активной точки
    }
    dots[indexActiveDot].classList.add('active');                           // Устанавливаем класс активной точки следующей точке
});

document.querySelector('.slider__btn_prev').addEventListener('click', function () {     // При нажатии на кнопку Prev
    if (animationFlag) return false;                                        // Если анимация запущена, то при нажатии ничего не произойдёт
    if (index <= 0) {                                                       // Если показан первый слайд коллекции
        index = images.length - 1;                                          // Индекс установить на последний слайд (клон первого)
        offset = -width * (images.length - 1);                              // Установить смещение коллекции на последний слайд (клон первого)
    }
    index--;                                                                // Уменьшаем индекс активного слайда
    rollSlider(1);                                                          // Вызывать функцию плавного перелистывания слайдов вправо
    dots[indexActiveDot].classList.remove('active');                        // Удаляем класс active у текущей точки
    if (indexActiveDot == 0) {                                              // Если активна первая точка
        indexActiveDot = dots.length - 1;                                   // Индекс активной точки передать последней точке
    } else {                                                                // Иначе
        indexActiveDot--;                                                   // Увеличить индекс активной точки
    }
    dots[indexActiveDot].classList.add('active');                           // Устанавливаем класс активной точки предыдущей точке
});

dots.forEach((item, indexDot) => {                                          // Для каждого элемента массива точек
    item.addEventListener('click', () => {                                  // При нажатии на одну из точек
        if (animationFlag) return false;                                    // Если анимация запущена, то при нажатии ничего не произойдёт
        if (index >= images.length - 1) {                                   // Если показан последний слайд коллекции (клон первого)
            index = 0;                                                      // Обнулить индекс
            offset = 0;                                                     // Обнулить смещение коллекции
        }
        if (index == indexDot) return false;                                // Если нажать на точку активного слайда, то ничего не произойдёт
        direction = index - indexDot;                                       // Направление смещения равно разнице индексов
        index = indexDot;                                                   // Изменяем индекс активного слайда
        dots[indexActiveDot].classList.remove('active');                    // Удаляем класс active у текущей точки
        indexActiveDot = indexDot;                                          // Изменяем индекс активной точки
        dots[indexActiveDot].classList.add('active');                       // Устанавливаем класс активной точки нажатой точке
        rollSlider(direction);                                              // Вызывать функцию плавного перелистывания слайдов
    });
});
