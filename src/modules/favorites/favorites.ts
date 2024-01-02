import html from './favorites.tpl.html';
import { Component } from '../component';
import { Product } from '../product/product';
import { favoritesService } from '../../services/favorites.service';
import { ProductData } from 'types';

class Favorites extends Component {
  products!: ProductData[];

  async render() {
    await this.update();

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: false });
      productComp.render();
      productComp.attach(this.view.list);
    });
  }

  async update() {
    this.products = await favoritesService.getFavorites();

    if (this.products.length < 1) {
        this.view.root.classList.add('is__empty');
        return;
    }
  }
}

export const favoritesComp = new Favorites(html);