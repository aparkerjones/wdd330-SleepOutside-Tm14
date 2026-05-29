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
  }

  init() {
    this.updateOrderSummary();
  }

  get cartItems() {
    return getLocalStorage("so-cart") || [];
  }

  calculateSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + Number(item.FinalPrice || 0), 0);
  }

  updateOrderSummary() {
    const subtotal = this.calculateSubtotal();
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.06;
    const total = subtotal + shipping + tax;

    const subtotalEl = document.querySelector("#order-subtotal");
    const shippingEl = document.querySelector("#order-shipping");
    const taxEl = document.querySelector("#order-tax");
    const totalEl = document.querySelector("#order-total");

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  buildOrderData() {
    const formData = new FormData(this.form);

    const subtotal = this.calculateSubtotal();
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.06;
    const orderTotal = subtotal + shipping + tax;

    return {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      items: this.cartItems,
      total: Number(orderTotal.toFixed(2)),
    };
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

  async checkout() {
    clearAlert();

    if (!this.cartItems.length) {
      alertMessage("Your cart is empty. Add at least one item before checkout.");
      return;
    }

    const order = this.buildOrderData();

    try {
      await this.services.checkout(order);
      setLocalStorage("so-cart", []);
      window.location.assign(`${import.meta.env.BASE_URL}checkout/success.html`);
    } catch (error) {
      alertMessage(this.formatError(error));
    }
  }
}
