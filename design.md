# Design
## DB
- Item
    - name: string
    - priceMin: number
    - priceMax: number
    - **Not Done**:
        - tags: array
        - revisions: array
        - created: date
        - deleted: date
- Transaction
    - item: itemID
    - created: date
    - price: number
    - amount: number
    - amountType: AmountType
    - currency: ?Currency
    - **Not Done**:
        - deleted: date
        - ?currencyToCZK: number
        - tags: array
        - revisions: array
- **Not Done**:
    - Tag
        - name: string
        - created: date
        - deleted: date