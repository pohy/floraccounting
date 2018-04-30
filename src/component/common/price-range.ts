import {
    TransactionItem,
    AmountTypes,
    SingleUnit,
} from '../../model/TransactionItem';

export function calculateTransactionItemsPriceRanges(
    transactionItems: TransactionItem[],
) {
    return {
        min: calculateTransactionItemsPrice(transactionItems, 'priceMin'),
        max: calculateTransactionItemsPrice(transactionItems, 'priceMax'),
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
