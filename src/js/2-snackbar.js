import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

function createPromise(delay, shouldResolve) {
  return new Promise((resolve, reject) => {

    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);

  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  const willResolve = state === "fulfilled";

  createPromise(delay, willResolve)
    .then((delayValue) => {
      iziToast.success({
        title: "OK",
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        position: "topRight",
      });
    })
    .catch((delayValue) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${delayValue}ms`,
        position: "topRight",
      });
    });
});