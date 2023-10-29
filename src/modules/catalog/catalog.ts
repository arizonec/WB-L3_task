import { Component } from '../component';
import html from './catalog.tpl.html';
import { userService } from '../../../src/services/user.service';
import { ProductList } from '../productList/productList';
import localforage from 'localforage';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const userId = localforage.getItem('__wb-userId') || await userService.getId();
    const productsResp = await fetch('/api/getProducts', {
        headers: {
            'x-userid': userId.toString()
        }
    });
    const products = await productsResp.json();
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
