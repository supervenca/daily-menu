import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
    // FORMS

    const forms = document.querySelectorAll(formSelector);
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'thank you, we will contact you',
        failure: 'something went wrong'
    };
//список сообщений для показа пользователю

    forms.forEach(item => {
        bindPostData(item);
    });

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
        openModal('.modal', modalTimerId);

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
            closeModal('.modal');
        }, 4000);
    }

    /* fetch('http://localhost:3000/menu')
         .then(data => data.json())
         .then(res => console.log(res)); */

}

export default forms;