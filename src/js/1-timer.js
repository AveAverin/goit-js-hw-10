import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (!pickedDate) return;

    const now = Date.now();

    if (pickedDate.getTime() <= now) {
      refs.startBtn.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userDate = pickedDate;
    refs.startBtn.disabled = false;
  },
};

flatpickr(refs.input, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(v) {
  return String(v).padStart(2, '0');
}

function drawTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

refs.startBtn.addEventListener('click', startTimer);

function startTimer() {
  if (!userDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  intervalId = setInterval(() => {
    const now = Date.now();
    const diff = userDate.getTime() - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      drawTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      refs.input.disabled = false;
      refs.startBtn.disabled = true;

      return;
    }

    const timeObj = convertMs(diff);
    drawTimer(timeObj);
  }, 1000);
}