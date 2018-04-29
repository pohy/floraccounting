import { get } from './http';
import { Item } from '../../model/Item';

export async function searchItems(query?: string): Promise<Item[]> {
    const results = await get(`/items${query ? `/${query}` : ''}`);
    return results.map((result: any) => new Item(result));
}
