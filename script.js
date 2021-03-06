const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


/**
 * write the selected (e.target.dataset.listId) in to (selectedListId) variable.
 */
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

/**
 * passes the checked function to each tasks container element and renders it.
 */
tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked
        save();
        renderTaskCount(selectedList);
    }
})

/**
 * filtered out the completed tasks and pushed in the array only not completed tasks and then rendered it.
 */
clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})

/**
 * filtered out the unselected lists into the same lists variable again and render it.
 */
deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
})

/**
 * create the new listObject and pushed in lists-array.
 */
newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == 0 || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
})

/**
 * create new taskObject and pushed in to current selectedList.tasks-array and render it.
 */
newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == 0 || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
})


/**
 * this is the first started render function for all Elements visualize.
 */
 render();


/**
 * 
 * @param {string} name - the input value of every new created list on [data-new-task-input]-selector InputField. 
 * @returns - new listObject with unique id and inputValue from name-variable.
 */
function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: []
    }
}

/**
 * 
 * @param {string} name - the input value of every new created task on [data-new-task-input]-selector InputField.
 * @returns - new taskObject with unique id and inputValue from name-variable.
 */
function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false
    }
}

/**
 * this function starts the save and render functions together.
 */
function saveAndRender() {
    save();
    render();
}

/**
 * save the actually listsArray and selectedListId into localStorage.
 */
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

/**
 * clear all elements and rewrite actually content. Shows the actually selected ListElement.
 */
function render() {
    clearElement(listsContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null || selectedList == undefined) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

/**
 * 
 * @param {string} selectedList - this variable gives the current id of the selected list element.
 * 
 * this function shows all tasks of the current selectedListElement.
 */
function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    })
}

/**
 * 
 * @param {string} selectedList - this variable gives the current id of the selected list element.
 *  This function shows the unfinished tasks.
 */
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

/**
 * this function create and visualize the ElementTags and content inside. 
 */
function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add('list-name');
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        listsContainer.appendChild(listElement);
    })
}

/**
 * 
 * @param {element} element - this variable includes the list-element-tag.
 * this function clear the selected list-element completely with content.
 */
function clearElement(element) {
    console.log('clearElement', element)
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
