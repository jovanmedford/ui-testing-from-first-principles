const counterMarkup = `
  <span id="count" aria-label="count">0</span>
  <button type="button" aria-label="decrement">-</button>
  <button type="button" aria-label="increment">+</button>
`;

export default function renderCounter(container) {
  const counter = document.createElement("div");
  counter.innerHTML = counterMarkup;

  const countDisplay = counter.querySelector("#count");
  const decrementButton = counter.querySelector('[aria-label="decrement"]');
  const incrementButton = counter.querySelector('[aria-label="increment"]');

  const changeCount = (amount) => {
    const currentValue = Number(countDisplay.textContent);
    countDisplay.textContent = String(currentValue + amount);
  };

  decrementButton.addEventListener("click", () => changeCount(-1));
  incrementButton.addEventListener("click", () => changeCount(1));

  container.append(counter);

  return counter;
}
