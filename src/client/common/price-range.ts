import {
    TransactionItem,
    AmountTypes,
    SingleUnit,
} from '../../common/model/TransactionItem';

export interface IPriceRange {
    priceMin: number;
    priceMax: number;
}

const ADD_PERCENT = 30;

export function recommendedPrice({
    priceMin = 0,
    priceMax = 0,
}: Partial<IPriceRange>): number {
    return priceMin + priceMin * (ADD_PERCENT / 100);
}

export function calculateTransactionItemsPriceRanges(
    transactionItems: TransactionItem[],
): IPriceRange {
    return {
        priceMin: calculateTransactionItemsPrice(transactionItems, 'priceMin'),
        priceMax: calculateTransactionItemsPrice(transactionItems, 'priceMax'),
    };
}

function calculateTransactionItemsPrice(
    transactionItems: TransactionItem[],
    field: 'priceMin' | 'priceMax',
): number {
    return sum(
        transactionItems.map(
            ({ amount, amountType, item: { [field]: price } }) =>
                calculateItemPricePerUnit(amount || 0, amountType, price || 0),
        ),
    );
}

function calculateItemPricePerUnit(
    amount: number,
    amountType: AmountTypes,
    price: number,
): number {
    return amount / SingleUnit[amountType] * price;
}

function sum(numbers: number[]) {
    return numbers.reduce((sum, number) => sum + number, 0);
}
