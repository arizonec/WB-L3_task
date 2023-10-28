import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';
import { eventSender } from '../../../src/services/sendAnalytics.service';

class Checkout extends Component {
  products!: ProductData[];
  totalPrice: number = 0;

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    this.totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
    this.view.price.innerText = formatPrice(this.totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this);
  }

  private async _makeOrder() {
    const productIds = this.products.map(product => product.id);

    eventSender.eventSend({
        type: 'purchase',
        payload : {
            orderId: Date.now(),
            totalPrice: this.totalPrice,
            productIds: productIds
        },
        timestamp: Date.now()
    })

    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    window.location.href = '/?isSuccessOrder';
  }
  
}

export const checkoutComp = new Checkout(html);
