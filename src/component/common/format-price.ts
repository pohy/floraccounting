export function formatPrice(price: number) {
    const decimal = 10;
    return Math.round(price * decimal) / decimal;
}
