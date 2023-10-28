import { Component } from '../component';
import { Product } from '../product/product';
import html from './favorites.tpl.html';
import { favoritesService } from '../../services/favorites.service';
import { ProductData } from 'types';

class Favorites extends Component {
  products!: ProductData[];

  async render() {
    this.products = await favoritesService.getFavorites();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: false }, true);
      productComp.render();
      productComp.attach(this.view.list);
    });
  }
}

export const favoritesComp = new Favorites(html);