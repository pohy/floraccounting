import { Item } from '../../common/model/Item';
import { Transaction, Currencies } from '../../common/model/Transaction';
import { http } from './http';

// TODO: Refactor into a class

const FIXED_EXCHANGE_RATES = {
    [Currencies.CZK]: 1,
    [Currencies.EUR]: 0.039,
    [Currencies.USD]: 0.047,
};

export async function searchItems(query?: string): Promise<Item[]> {
    const results = await http.get(`/items${query ? `/${query}` : ''}`);
    return results.map((result: any) => new Item(result));
}

export async function fetchTransactions(): Promise<Transaction[]> {
    const results = await http.get('/transactions');
    return results.map((result: any) => new Transaction(result));
}

export async function findTransaction(id: string): Promise<Transaction | null> {
    const transaction = await http.get(`/transactions/${id}`);
    if (!transaction) {
        return null;
    }
    return new Transaction(transaction);
}

export async function fetchExchangeRate(currency: Currencies): Promise<number> {
    const exchangePair = `CZK_${currency}`;
    const REQUEST_URL = `https://free.currencyconverterapi.com/api/v5/convert?q=${exchangePair}&compact=y`;
    try {
        const {
            [exchangePair]: { val },
        } = (await http.fetchJSON(REQUEST_URL)) as any;
        return val;
    } catch (error) {
        return FIXED_EXCHANGE_RATES[currency];
    }
}

export async function isAuthenticated(): Promise<boolean> {
    try {
        await http.get('/is-authenticated');
        return true;
    } catch (error) {
        return false;
    }
}
