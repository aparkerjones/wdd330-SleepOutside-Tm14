import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("#checkoutForm");
myCheckout.init();

const submitButton = document.querySelector("#checkoutSubmit");

if (submitButton) {
	submitButton.addEventListener("click", (event) => {
		event.preventDefault();

		const checkoutForm = document.querySelector("#checkoutForm");
		if (!checkoutForm) {
			return;
		}

		const isValid = checkoutForm.checkValidity();
		checkoutForm.reportValidity();

		if (isValid) {
			myCheckout.checkout();
		}
	});
}
