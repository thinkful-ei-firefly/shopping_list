"use strict";

const STORE = [
  { id: cuid(), name: "apples", checked: false },
  { id: cuid(), name: "oranges", checked: false },
  { id: cuid(), name: "milk", checked: true },
  { id: cuid(), name: "bread", checked: false }
];

const renderShoppingList = () => {
  const shoppingListItemsString = generateShoppingItemsString(STORE);
  $(".js-shopping-list").html(shoppingListItemsString);
};

const handleNewItemSubmit = () => {
  $("#js-shopping-list-form").submit(function(event) {
    event.preventDefault();
    const newItemName = $(".js-shopping-list-entry").val();
    $(".js-shopping-list-entry").val("");
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
};

const handleItemCheckClicked = () => {
  $(".js-shopping-list").on("click", `.js-item-toggle`, event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
};

const handleDeleteItemClicked = () => {
  $(".js-shopping-list").on("click", `.js-item-delete`, event => {
    const id = getItemIdFromElement(event.currentTarget);
    deleteItem(id);
    renderShoppingList();
  });
};

const handleShoppingList = () => {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
};

// when the page loads, call `handleShoppingList`
$(handleShoppingList);