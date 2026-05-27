import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    document.querySelector('.product-detail').innerHTML = 
      `<h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.NameWithoutBrand}"/>
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>`;
  }
}

//function productDetailsTemplate(product) {
//  document.querySelector('h2').textContent = product.Brand.Name;
//  document.querySelector('h3').textContent = product.NameWithoutBrand;
//
//  const productImage = document.getElementById('productImage');
//  productImage.src = product.Image;
//  productImage.alt = product.NameWithoutBrand;
//
//  document.getElementById('productPrice').textContent = product.FinalPrice;
//  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
//  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
//
//  document.getElementById('addToCart').dataset.id = product.Id;
//
//
//  return `<section class="product-detail">
//      <h3>${product.Name}</h3>
//      <h2 class="divider">${product.NameWithoutBrand}</h2>
//      <img
//        class="divider"
//        src="${product.Image}"
//        alt="${product.NameWithoutBrand}"/>
//      <p class="product-card__price">$${product.FinalPrice}</p>
//      <p class="product__color">${product.Colors[0].ColorName}</p>
//      <p class="product__description">
//        ${product.DescriptionHtmlSimple}
//      </p>
//      <div class="product-detail__add">
//        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//      </div>
//    </section>`
//}