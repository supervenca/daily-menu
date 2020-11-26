function modal() {
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
}

module.exports = modal;