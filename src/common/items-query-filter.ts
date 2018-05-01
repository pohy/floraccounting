import { Item } from './model/Item';

export function itemsQueryFilter(items: Item[], query: string): Item[] {
    return items.filter(
        ({ name }) =>
            name
                .normalize('NFD')
                .toLowerCase()
                .indexOf(query.normalize('NFD').toLowerCase()) > -1,
    );
}
