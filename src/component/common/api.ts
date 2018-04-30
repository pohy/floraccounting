import { get } from './http';
import { Item } from '../../model/Item';
import { Transaction } from '../../model/Transaction';

export async function searchItems(query?: string): Promise<Item[]> {
    const results = await get(`/items${query ? `/${query}` : ''}`);
    return results.map((result: any) => new Item(result));
}

export async function fetchTransactions(): Promise<Transaction[]> {
    const results = await get('/transactions');
    return results.map((result: any) => new Transaction(result));
}
