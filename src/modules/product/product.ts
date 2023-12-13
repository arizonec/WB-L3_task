import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers'
import html from './product.tpl.html';
import { ProductData } from 'types';
import { favoritesService } from '../../services/favorites.service';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  detach(e: MouseEvent) {
    e.preventDefault();
    favoritesService.removeProductFromFav(this.product);
    this.view.root.remove();
  }

  async render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);
    
    this.view.removeButton.onclick = (e: MouseEvent) => this.detach(e);

    const isInFavorites = await favoritesService.isInFavorites(this.product);
    
    this.view.btnToFavorites.onclick = async (e: MouseEvent) => {
        e.preventDefault();
        if (!this.product) return;
    
        const isInFavorites = await favoritesService.isInFavorites(this.product);
        if (isInFavorites) {
          favoritesService.removeProductFromFav(this.product);
          this.view.btnToFavorites.classList.remove('inFavorites');
        }
        if (!isInFavorites) {
          favoritesService.addProductToFav(this.product);
          this.view.btnToFavorites.classList.add('inFavorites');
        }
      };

    if (isInFavorites) this.view.btnToFavorites.classList.add('inFavorites');
    
    this.params.isHorizontal ? this.view.root.classList.add('is__horizontal') : this.view.root.classList.add('is__vertical');

    if(window.location.pathname === '/favorites') this.view.removeButton.classList.add('is-shown')
    if(window.location.pathname === '/' || window.location.pathname === '/catalog') this.view.btnToFavorites.classList.add('is-heart-shown');
  }

  async addToFavorites(e: MouseEvent) {
    e.preventDefault();
    if (!this.product) return;
    if (await favoritesService.isInFavorites(this.product)) return;
  
    favoritesService.addProductToFav(this.product);
    this.view.btnToFavorites.classList.add('inFavorites');
  }
  
  async removeFromFavorites(e: MouseEvent) {
    e.preventDefault();
    if (!this.product) return;
    if (!await favoritesService.isInFavorites(this.product)) return;
  
    favoritesService.removeProductFromFav(this.product);
    this.view.btnToFavorites.classList.remove('inFavorites');
  }
}