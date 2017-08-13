# TODO

## In progress


## New

- [ ] Remember most used price, tags, amount of items
- [ ] Transaction editing
    - [ ] Track revisions
- [ ] Tag transactions
- [ ] Statistics
- [ ] Translations
- [ ] ?Toggleable on screen keyboard
- [ ] eslint/flowtype
- [ ] Tests
- [ ] Research automatic revisions
- [ ] Auto input next on
- [ ] Transaction date formatting
- [ ] Refactor TransactioForm to make it simpler
- [ ] Sort items by most used
- [ ] favicon
- [ ] Restyle transaction form
- [ ] Let the user know, when the network request fails
- [ ] Offline support
- [ ] Editable price ranges

## Done

- [x] Auto suggest items
- [x] Auto create item when submitting an unknown one
    - [ ] ~~It is created when submitting new transaction ( field `newItem`)~~
    - [x] Suggest inputting a price for an unknown item
- [x] Save transaction correctly
    - [x] `item` as ID
    - [x] Empty weird field
    - [x] Remove `newItem`
- [x] Prop types
- [x] Store open price for every item
- [ ] ~~Rename `priceMax` to `priceSuggested`~~
- [x] Auto unfold type select
- [x] Don't delete form right after submit, instead, wait for server response
- [x] Currencies
- [x] Bartenders
    - [x] List of users, no login, choose user before submitting a transaction
