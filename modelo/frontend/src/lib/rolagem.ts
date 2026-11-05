/** Marca a área que está rolando por um instante, para a barra de rolagem aparecer só nessa hora. */
const timers = new WeakMap<Element, number>();

export function ligarBarraDiscreta() {
  document.addEventListener(
    "scroll",
    (ev) => {
      const alvo = ev.target instanceof Element ? ev.target : document.documentElement;
      alvo.setAttribute("data-rolando", "");
      window.clearTimeout(timers.get(alvo));
      timers.set(alvo, window.setTimeout(() => alvo.removeAttribute("data-rolando"), 900));
    },
    true,
  );
}
