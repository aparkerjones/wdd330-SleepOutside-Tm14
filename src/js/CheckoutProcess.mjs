import ExternalServices from "./ExternalServices.mjs";
import {
  alertMessage,
  clearAlert,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

export default class CheckoutProcess {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.services = new ExternalServices();
    this.subtotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.calculateOrderSubtotal();

    const zipInput = this.form?.querySelector("#zip");
    if (zipInput) {
      zipInput.addEventListener("change", () => {
        this.calculateOrderTotal();
      });
      zipInput.addEventListener("blur", () => {
        this.calculateOrderTotal();
      });
    }
  }

  get cartItems() {
    return getLocalStorage("so-cart") || [];
  }

  calculateSubtotal() {
    return this.cartItems.reduce(
      (sum, item) => sum + Number(item.FinalPrice || 0),
      0,
    );
  }

  calculateOrderSubtotal() {
    this.subtotal = this.calculateSubtotal();
    const subtotalEl = document.querySelector("#order-subtotal");
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.subtotal.toFixed(2)}`;
    }
  }

  calculateShipping(itemCount) {
    if (!itemCount) {
      return 0;
    }

    return 10 + (itemCount - 1) * 2;
  }

  calculateOrderTotal() {
    this.calculateOrderSubtotal();
    this.shipping = this.calculateShipping(this.cartItems.length);
    this.tax = Number((this.subtotal * 0.06).toFixed(2));
    this.orderTotal = Number((this.subtotal + this.shipping + this.tax).toFixed(2));

    const shippingEl = document.querySelector("#order-shipping");
    const taxEl = document.querySelector("#order-tax");
    const totalEl = document.querySelector("#order-total");

    if (shippingEl) {
      shippingEl.textContent = `$${this.shipping.toFixed(2)}`;
    }
    if (taxEl) {
      taxEl.textContent = `$${this.tax.toFixed(2)}`;
    }
    if (totalEl) {
      totalEl.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice || 0),
      quantity: 1,
    }));
  }

  formDataToJSON(formElement) {
    const data = new FormData(formElement);
    return Object.fromEntries(data.entries());
  }

  buildOrderData(formElement) {
    const orderData = this.formDataToJSON(formElement);
    this.calculateOrderTotal();

    orderData.orderDate = new Date().toISOString();
    orderData.items = this.packageItems(this.cartItems);
    orderData.orderTotal = this.orderTotal.toFixed(2);
    orderData.shipping = this.shipping;
    orderData.tax = this.tax.toFixed(2);

    return orderData;
  }

  formatError(error) {
    if (error?.name === "servicesError") {
      const message = error.message;

      if (typeof message === "string") {
        return message;
      }

      if (Array.isArray(message?.errors)) {
        return message.errors.join(" ");
      }

      if (message?.message) {
        return message.message;
      }

      return "Checkout failed. Please review your information and try again.";
    }

    return "Something went wrong while placing your order. Please try again.";
  }

  async checkout(formElement = this.form) {
    clearAlert();

    if (!this.cartItems.length) {
      alertMessage("Your cart is empty. Add at least one item before checkout.");
      return;
    }

    const order = this.buildOrderData(formElement);

    try {
      await this.services.checkout(order);
      setLocalStorage("so-cart", []);
      window.location.assign(`${import.meta.env.BASE_URL}checkout/success.html`);
    } catch (error) {
      alertMessage(this.formatError(error));
    }
  }
}
