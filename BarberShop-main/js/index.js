const menuOpen = document.querySelector('.header__mobile-btn');
const menuClose = document.querySelector('.header__modal-btn');
const menu = document.querySelector('.header__modal');
const backdrop = document.querySelector('.backdrop');
const ESC_KEY_CODE = 'Escape';

function onOpen() {
  menu.classList.remove('is-hidden');
  backdrop.classList.remove('is-hidden');
  document.body.style.overflowY = 'hidden';
  backdrop.addEventListener('click', onBackdrop);
  menu.addEventListener('click', onButton);
  window.addEventListener('keydown', onEscKeyPress);
}

function onClose() {
  menu.classList.add('is-hidden');
  backdrop.classList.add('is-hidden');
  document.body.style.overflowY = 'scroll';
  backdrop.removeEventListener('click', onBackdrop);
  menu.removeEventListener('click', onButton);
  window.removeEventListener('keydown', onEscKeyPress);
}

function onButton(evt) {
  if (evt.target.nodeName !== 'A') {
    console.log(7);
    return;
  }
  onClose();
}

function onBackdrop(evt) {
  if (evt.target !== evt.currentTarget) {
    return;
  }
  console.log(1);
  onClose();
}

function onEscKeyPress(event) {
  if (event.code === ESC_KEY_CODE) {
    onClose();
  }
}

menuOpen.addEventListener('click', onOpen);
menuClose.addEventListener('click', onClose);

const imgArray = ['images/slider-3.jpg', 'images/slider-1.jpg', 'images/slider-2.jpg'];
const slider = document.querySelector('.hero__content');

let intervalId = null; 

const startSlider = () => {
  let i = 1;
  slider.style.backgroundImage = `url(${imgArray[0]})`;
  intervalId = setInterval(() => {
    slider.style.backgroundImage = `url(${imgArray[i++]})`;
    if (i === imgArray.length) i = 0;
  }, 9000);
};

const stopSlider = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const updateSlider = () => {
  if (window.innerWidth > 768) {
    stopSlider();
    startSlider();
  } else {
    stopSlider();
    slider.style.backgroundImage = `url(${imgArray[0]})`;
  }
};

updateSlider();

async function signUp(name, phone, message) {
  try {
    const response = await fetch('http://localhost:3004/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone, message }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке данных');
    }

    const result = await response.json();
    console.log('Данные успешно отправлены:', result);
    return result;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

document.getElementById('bookingForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = event.target.name.value.trim();
  const phone = event.target.phone.value.trim();
  const message = event.target.message.value.trim();

  if (!name || !phone || !message) {
    console.error('Заполните все поля формы');
    return;
  }

  await signUp(name, phone, message);
  event.target.reset();
});

window.addEventListener('resize', updateSlider);
