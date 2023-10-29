import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { HintsList } from 'types';

import { ProductList } from '../productList/productList';

class Homepage extends Component {
  popularProducts: ProductList;
  hints: HintsList;

  constructor(props: any) {
    super(props);

    this.hints = [
    {
        name: 'чехол iphone 13 pro',
        link: 'https://global.wildberries.ru/catalog?search=iphone%2013%20pro%20%D1%87%D0%B5%D1%85%D0%BE%D0%BB&tail-location=SNS'
    },
    {
        name: 'коляска agex',
        link: 'https://global.wildberries.ru/catalog?search=%D0%BA%D0%BE%D0%BB%D1%8F%D1%81%D0%BA%D0%B0%20agex&tail-location=SNT'
    },
    {
        name: 'яндекс станция 2',
        link: 'https://global.wildberries.ru/catalog?search=%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D1%81%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D1%8F%202&tail-location=SNT'
    }
    ];

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
  }

  setHints(hints: HintsList) {
    this.hints = hints;
    this.render();
  }

  render() {
    const hintsList = this.view.search_hints.children;

    if(hintsList) {
        for(let i = 0; i < hintsList.length; i++) {
            hintsList[i].innerHTML = `<a class='hint__link' href=${this.hints[i].link}>${this.hints[i].name}</a>`
        }
    }

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);
      });

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const homepageComp = new Homepage(html);
