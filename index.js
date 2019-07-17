'use strict';

const STORE = {
  items: [
    // eslint-disable-next-line no-undef
    {id: cuid(), name: 'apples', checked: false, canEdit: false},
    // eslint-disable-next-line no-undef
    {id: cuid(), name: 'oranges', checked: false, canEdit: false},
    // eslint-disable-next-line no-undef
    {id: cuid(), name: 'milk', checked: true, canEdit: false},
    // eslint-disable-next-line no-undef
    {id: cuid(), name: 'bread', checked: false, canEdit: false}
  ],
  hideCompleted: false,
  filter: {
    filterOn: true,
    filterBy: ''
  }
};

function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      
      <span class="shopping-item js-shopping-item 
      ${item.checked ? 'shopping-item__checked' : ''}" 
      ${item.canEdit ? 'contenteditable="true"' : ''}
      >${item.name}</span>
      
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">${item.canEdit ? 'done' : 'edit'}</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM

  // set up a copy of the store's items in a local variable that we will reassign to a new
  // version if any filtering of the list occurs
  let filteredItems = STORE.items;

  // if the `hideCompleted` property is true, then we want to reassign filteredItems to a version
  // where ONLY items with a "checked" property of false are included
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  
  if (STORE.filter.filterOn) {
    filteredItems = filteredItems.filter(item => item.name.includes(STORE.filter.filterBy));
  }

  // at this point, all filtering work has been done (or not done, if that's the current settings), so
  // we send our `filteredItems` into our HTML generation function 
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function handleFilterBySubmit() {
  $('#js-shopping-list-filter').submit(function(event) {
    event.preventDefault();
    STORE.filter.filterBy = $('.js-shopping-list-filter').val();
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}


function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemId) {

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // First we find the index of the item with the specified id using the native
  // Array.prototype.findIndex() method. Then we call `.splice` at the index of 
  // the list item we want to remove, with a removeCount of 1.
  const itemIndex = STORE.items.findIndex(item => item.id === itemId);
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIdFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

function enableEditListItem(itemId) {
  const item = STORE.items.find(item => item.id === itemId);
  const newItemName = $(event.target).parents('li').find('.js-shopping-item');
  if (item.canEdit) {
    item.name = newItemName.html();
  }
  item.canEdit = !item.canEdit;
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const itemID = getItemIdFromElement(event.currentTarget);
    enableEditListItem(itemID);
    renderShoppingList();
    $(`li[data-item-id="${itemID}"] .js-shopping-item`).focus();

  });
}

// Toggles the STORE.hideCompleted property
function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

// Places an event listener on the checkbox for hiding completed items
// quiet, listeners are listening. 
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleFilterBySubmit();
  handleEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);