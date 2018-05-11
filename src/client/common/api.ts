import { get, fetchJSON } from './http';
import { Item } from '../../common/model/Item';
import { Transaction, Currencies } from '../../common/model/Transaction';

export async function searchItems(query?: string): Promise<Item[]> {
    const results = await get(`/items${query ? `/${query}` : ''}`);
    return results.map((result: any) => new Item(result));
}

export async function fetchTransactions(): Promise<Transaction[]> {
    const results = await get('/transactions');
    return results.map((result: any) => new Transaction(result));
}

export async function fetchExchangeRate(currency: Currencies): Promise<number> {
    const exchangePair = `CZK_${currency}`;
    const REQUEST_URL = `https://free.currencyconverterapi.com/api/v5/convert?q=${exchangePair}&compact=y`;
    const {
        [exchangePair]: { val },
    } = (await fetchJSON(REQUEST_URL)) as any;
    return val;
}

export async function isAuthenticated(): Promise<boolean> {
    try {
        await get('/is-authenticated');
        console.log('cool');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
