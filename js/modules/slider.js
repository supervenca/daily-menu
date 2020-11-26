function slider() {
    // Slider

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
    //получаем заданную CSS ширину
    let slideIndex = 1;
    let offset = 0;
//индекс, определяющий текущее положение в слайдере

    /* var 1
    showSlides(slideIndex);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`
    }else {
        total.textContent = slides.length;
    }
//настройка отображения общего количества слайдов

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        slides.forEach(item => item.style.display = 'none');
        slides[slideIndex - 1].style.display = 'block';

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        }else {
            current.textContent = slideIndex;
        }
    }
//в аргумент функции (n) передается slideIndex
//ЕСЛИ мы перешли к последнему слайду, то переходим в начало
//+такая же операция в обратную сторону
//Перебираем все слайды, и скрываем их со страницы
//Выбираем нужный слайд (-1 потому что мы начали отсчет с 1, а не с 0)
//и делаем его видимым
//настраиваем отображение порядкого номера текущего слайда

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

//эта функция будет менять порядковый номер slideIndex при перелистывании

    prev.addEventListener('click', () => {
        plusSlides(-1);
    });
    next.addEventListener('click', () => {
        plusSlides(1);
    }); */

    //var 2
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
//такая запись нужна для преобразования потом в CSS (длину слайда * 100%)
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });
    //перебираем слайды и устанавливаем им ширину, чтобы они все были одинаковые и
    //поместились в slidesField

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        //создание точек навигации как ordered list
        dots = [];
    //создаем массив
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);
    //помещаем обертку внутрь слайдера

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i == 0) {
            dot.style.opacity = 1;
        }
        //устанавливаем для первого индикатора заливку (у остальных по умолчанию остается полупрозрачность)

        indicators.append(dot);
        dots.push(dot);
        //помещаем точки в массив
    }

    function replaceLetters(str) {
        return +str.replace(/\D/g,'');
    }

    next.addEventListener('click', () => {
        if (offset == replaceLetters(width) * (slides.length - 1)) {
            offset =0; //когда долистали до конца, возвращаемся в начало
        } else {
            offset += replaceLetters(width);
        }//когда мы нажимаем вперед, к офсету добавляется ширина еще одного слайда
        //c помощью рег.выр. убираем буквы px из значения ширины и оставляем только число

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length){
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';
    });
    //переключение слайдов вперед

    prev.addEventListener('click', () => {
        if (offset == 0) { //когда вернулись к первому слайду
            offset = replaceLetters(width) * (slides.length - 1);
        } else {
            offset -= replaceLetters(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1){
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';
    });
    //переключение слайдов назад

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = replaceLetters(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = '1';
        });
    });
    //функциональность индикаторов

}

module.exports = slider;
