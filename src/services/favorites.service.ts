import localforage from 'localforage';
import { ProductData } from 'types';

const FDB = '__favorites';

class FavoritesService {
  init() {
    this._updCountersFav();
  }

  async addProductToFav(product: ProductData) {
    const products = await this.getFavorites();
    await this.setFavorites([...products, product]);
  }

  async removeProductFromFav(product: ProductData) {
    const products = await this.getFavorites();
    await this.setFavorites(products.filter(({ id }) => id !== product.id));
  }

  async clear() {
    await localforage.removeItem(FDB)
    this._updCountersFav();
  }

  async getFavorites(): Promise<ProductData[]> {
    return (await localforage.getItem(FDB)) || [];
  }

  async setFavorites(data: ProductData[]){
    await localforage.setItem(FDB, data);
    this._updCountersFav();
  }

  async isInFavorites(product: ProductData) {
    const products = await this.getFavorites(); 
    return products.some(({ id }) => id === product.id);
  }

  private async _updCountersFav() {
    const products = await this.getFavorites();
    const count = products.length >= 10 ? '9+' : products.length;

    //@ts-ignore
    document.querySelectorAll('.js__favorites-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }
}

export const favoritesService = new FavoritesService();