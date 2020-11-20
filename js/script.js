window.addEventListener('DOMContentLoaded', () => {
//tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabContentParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show','fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show','fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabContentParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item,i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }

    });
//timer
    const deadline = '2020-11-12';

    function getTimeRemaining (endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60 ) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days' : days,
            'hours': hours,
            'minutes' :minutes,
            'seconds' : seconds
        };
    }

    function getZero (num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }//функция для подставления 0 перед однозначными числами

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(updateClock, 1000);

        updateClock();//вызывается здесь, чтобы предотвратить баг мигания цифр из верстки

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

//modal window
//в HTML перед элементом (кнопкой) прописать data-modal, data-close
//при использовании toggle добавляем show после modal в HTML

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        //modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
//если пользователь уже сам закрыл и открыл окно, оно открываться не будет
    }
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
//если кликает на зону за модальным окном = modal или нажимает на крестик (data-close)
          closeModal();
        }
// то модальное окно закрывается
            });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });
//если нажимают клавишу ESC, и при этом окно открыто, оно закрывается

//модальное окно появляется через 5 сек:
    const modalTimerId = setTimeout(openModal, 50000);

//открывать модальное окно, когда пользователь домотал страницу до конца:
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
//но как только он его увидел, больше не должно выскакивать
        }
    }
    window.addEventListener('scroll', showModalByScroll);

// Используем классы для карточек

    class MenuCard {
        constructor(src, alt,title,descr,price,parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27; //курс валюты
            this.changeToUAH();
        }
// c помощью оператора rest добавили возможность добавлять
// не обозначенные заранее (как src,alt и т.д.) классы

// метод - конвертер валют:
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
// метод - формирование вёрстки:
        render () {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));

            }
            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                    `;
            this.parent.append(element);
//помещение новосозданного элемента в родителя
        }
    }

 /*   getResourse('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img,altimg,title,descr,price}) => {
                new MenuCard(img,altimg,title,descr,price, ".menu .container").render();
            });
        });*/

//получаем данные с сервера (data) в виде массива (состоящего из объектов),
//перебираем элементы массива (объекты)
//и вызываем функцию-конструктор формирования верстки для новых объектов меню
//конструктор будет создавать новую карточку столько раз, сколько найдется
//объектов в массиве, полученном с db.json
//также применяем к объекту деструктуризацию {img,altimg,title,description,price}

/* другой способ сделать так же:
       getResourse('http://localhost:3000/menu')
                  .then(data => createCard(data));

              function createCard(data) {
                  data.forEach(({img,altimg,title,descr,price}) => {
                      const element = document.createElement('div');
                      element.classList.add('menu__item');
                      element.innerHTML = `
                      <img src=${img} alt=${altimg}>
                              <h3 class="menu__item-subtitle">${title}</h3>
                              <div class="menu__item-descr">${descr}</div>
                              <div class="menu__item-divider"></div>
                              <div class="menu__item-price">
                                  <div class="menu__item-cost">Цена:</div>
                                  <div class="menu__item-total"><span>${price}</span> грн/день</div>
                              </div>
                      `;

                      document.querySelector('.menu .container').append(element);
                  });
              }
              */

//способ с подключением библиотеки axios:

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img,altimg,title,descr,price}) => {
                new MenuCard(img,altimg,title,descr,price, '.menu .container').render();
            });
        });



    // FORMS

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'thank you, we will contact you',
        failure: 'something went wrong'
    };
//список сообщений для показа пользователю

    forms.forEach(item => {
        bindPostData(item);
    });

// функция postData настраивает запрос на сервер, фетчит (отправляет),
// получает ответ и трансформирует его в json
// async означает, что внутри функции будет асинхронный код
// await ставится перед теми операциями, которых необходимо дождать
// async и await - парные операторы, всегда идут вместе
    const postData = async (url,data) => {
        const res = await fetch(url, {
//res - это промис
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

//функция получения данных с сервера (GET)
//получаем данные и с помощью них формируем карточки меню на сайте
    async function getResourse(url) {
        let res = await fetch(url);
//res - это промис
        if(!res.ok) {
            throw new Error (`Could not fetch ${url}, status: ${res.status}`);
        }
//если результат не ок, то мы выкидываем сообщение об ошибке
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
//для предотвращения перезагрузки страницы при отправке формы
            let statusMessage = document.createElement('img');
//создание оповещения, которое должно выйти после отправки формы - значок спиннера(при медленном интернете)
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
//добавление оповещения в форму

            const formData = new FormData(form);
//данные из формы в формате ключ: значение
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
//получение данных из формы в формате массив массивов
//а затем превращение массива обратно в объект,
//а потом этот объект в JSON

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
//показывается модальное окно с сообщением 'thank you, we will contact you'
//через 4 сек оно будет закрываться, как задано в функции
                form.reset();
//сброс данных из формы
                statusMessage.remove();
//удаление значка спиннера(видим только при медленном интернете)
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

        });
    }
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
//cкрываем модальное окно с формой
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>`;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);
    }

   /* fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res)); */


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


    // Calculator

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 'female';
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector,activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem ('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }
    initLocalSettings('#gender div','calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div','calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = 'Введите все данные';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInfo(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio',+e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex',e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInfo('#gender div','calculating__choose-item_active'); // пол

    getStaticInfo('.calculating__choose_big div','calculating__choose-item_active'); // активность

    function getDinamicInfo(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });

    }
    getDinamicInfo('#height');
    getDinamicInfo('#weight');
    getDinamicInfo('#age');
});


/* Алгоритм создания навигации для слайдера (точек/индикаторов внизу)

 - Получить как элемент весь слайдер (а не только wrapper)
 - У точек должна быть position:relative (прикреплены к слайдеру)
 - Создание обертки для точек
 - С помощью цикла или перебирающего метода создать количество точек,
 которое будет равно количеству слайдов
 - Каждой точке задается атрибут, определяющий какая точка к какому слайду относится,
 отображение активности  индикатора
 - Функциональность индикаторов: переключение также при нажатии на них и переключение цифр вверху

 */
