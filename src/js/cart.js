import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.FinalPrice || 0), 0);
}

function renderCartTotal(items) {
  const totalElement = document.querySelector(".cart-total");
  if (!totalElement) {
    return;
  }

  if (!items.length) {
    totalElement.textContent = "Total: $0.00";
    return;
  }

  const total = calculateCartTotal(items);
  const itemLabel = items.length === 1 ? "item" : "items";
  totalElement.textContent = `Total (${items.length} ${itemLabel}): $${total.toFixed(2)}`;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const checkoutLink = document.querySelector(".checkout-link");
  const checkoutActions = document.querySelector(".cart-actions");

  if (!cartItems.length) {
    document.querySelector(".product-list").innerHTML =
      "<li>Your cart is empty.</li>";
    if (checkoutActions) {
      checkoutActions.hidden = true;
    } else if (checkoutLink) {
      checkoutLink.style.display = "none";
    }
    renderCartTotal(cartItems);
    return;
  }

  if (checkoutActions) {
    checkoutActions.hidden = false;
  }
  if (checkoutLink) {
    checkoutLink.style.removeProperty("display");
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const imageSrc = item.Images?.PrimaryMedium || item.Image;
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
