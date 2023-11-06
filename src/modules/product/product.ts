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
  removeButton: boolean;

  constructor(product: ProductData, params: ProductComponentParams = {}, removeButton: boolean = false) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
    this.removeButton = removeButton;
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);
    this.removeButton && this.view.removeButton.classList.add('removeButton')
    
    this.view.removeButton.onclick = (event: Event) => {
        event.preventDefault();
        favoritesService.removeProductFromFav(this.product);
        this.view.root.remove();
    };
    
    if (this.params.isHorizontal) {
        this.view.root.classList.add('is__horizontal')
    } else {
        this.view.root.classList.add('is__vertical')
    }
  }
}