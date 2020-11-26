function cards() {
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

}

module.exports = cards;