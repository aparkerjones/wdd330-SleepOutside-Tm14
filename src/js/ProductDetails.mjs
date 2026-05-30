import {
  alertMessage,
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      return;
    }

    this.renderProductDetails();
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
    alertMessage(`${this.product.NameWithoutBrand} added to cart.`, false);
  }

  renderProductDetails() {
    const imageSrc = this.product.Images?.PrimaryLarge || this.product.Image;
    const colorName = this.product.Colors?.[0]?.ColorName || "N/A";

    document.querySelector(".product-detail").innerHTML = `<h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img class="divider" src="${imageSrc}" alt="${this.product.NameWithoutBrand}" />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${colorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>`;
  }
}
