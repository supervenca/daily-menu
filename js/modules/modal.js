function openModal(modalSelector,modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    //modal.classList.toggle('show');
    document.body.style.overflow = 'hidden';
    console.log(modalTimerId);

    if (modalTimerId) {
        clearInterval(modalTimerId);
    }

}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    //modal window

    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
//если кликает на зону за модальным окном = modal или нажимает на крестик (data-close)
            closeModal(modalSelector);
        }
// то модальное окно закрывается
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });
//если нажимают клавишу ESC, и при этом окно открыто, оно закрывается

//открывать модальное окно, когда пользователь домотал страницу до конца:
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
//но как только он его увидел, больше не должно выскакивать
        }
    }
    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModal};
export {openModal};