// Dark mode code
let switchTheme = document.querySelector(".switch-theme");

let darkmodeStatus = localStorage.getItem("darkmode");

if (darkmodeStatus === "active") {
    enableDarkMode();
}

function enableDarkMode() {
    document.querySelector("body").classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
    switchTheme.style.backgroundImage = `url(./assets/light-mode.svg)`;
}

function disableDarkMode() {
    document.querySelector("body").classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
    switchTheme.style.backgroundImage = `url(./assets/dark-mode.svg)`;
}
switchTheme.addEventListener("click", () => {
    darkmodeStatus = localStorage.getItem("darkmode");
    darkmodeStatus !== "active" ? enableDarkMode() : disableDarkMode();
});

/* -------------------------- Dark Mode Ends Here -------------------------- */

/* Board Modal */

const addNewBoard = document.querySelector(".add-new-board");

addNewBoard.addEventListener("click", displayBoardModal);
document
    .querySelector(".board-modal-close")
    .addEventListener("click", hideBoardModal);
document
    .querySelector(".board-modal-cancel")
    .addEventListener("click", hideBoardModal);

function displayBoardModal() {
    document.querySelector(".board-modal").style.display = "block";
    hideTaskModal();
    selectBoardLogoColor();
}

function hideBoardModal() {
    document.querySelector(".board-modal").style.display = "none";
    currentBoardId = null;
    currentBoardIndex = -1;
    document.getElementById("board-modal-name").value = "";
    document.getElementById("board-modal-description").value = "";
}

/* -------------------------- Board Modal Ends Here -------------------------- */

/* Task Modal */

document.querySelectorAll(".add-task-btn").forEach((taskBtn) => {
    taskBtn.addEventListener("click", displayTaskModal);
});
document
    .querySelector(".task-modal-close")
    .addEventListener("click", hideTaskModal);
document
    .querySelector(".task-modal-cancel")
    .addEventListener("click", hideTaskModal);

function displayTaskModal() {
    document.querySelectorAll(".task-modal").forEach(task => {
        task.style.display = "block";
    })
    hideBoardModal();
}

function hideTaskModal() {
    document.querySelector(".task-modal").style.display = "none";
    document.getElementById("board-modal-name").value = "";
    document.getElementById("board-modal-description").value = "";

    currentBoardId = null;
    currentBoardIndex = -1;
    currentTaskIndex = -1;
    currentTaskId = null;

    document.getElementById("task-modal-name").value = "";
    document.getElementById("task-modal-description").value = "";

}

/* -------------------------- Board Modal Ends Here -------------------------- */

// Updating single dom elelment


function updateTaskInDOM(id, name, description, color, items) {
    const elelment = document.getElementById(`${id}`);

    if (!name && !description && !color) {
        elelment.firstChild.firstChild.children[2].textContent = items;

    }

    else if (!id.includes('task')) {
        elelment.firstChild.firstChild.firstChild.style.border = `2px solid ${color}`;
        elelment.firstChild.firstChild.children[1].textContent = name;
        elelment.firstChild.firstChild.nextSibling.textContent = description;

    }
    else {
        elelment.firstChild.children[1].textContent = name;
        elelment.lastChild.textContent = description;
    }
}










/* -------------------------- Updating Single DOM Element Ends Here -------------------------- */








/* Creating A New Board */

let boards = [];
let currentBoardId = null;
let currentBoardIndex = -1;

document
    .querySelector(".board-modal-submit")
    .addEventListener("click", storeNewBoard);

let boardlogo = "#ff0088";
function selectBoardLogoColor() {
    document.querySelectorAll(".color-option").forEach((color) => {
        color.addEventListener("click", () => {
            boardlogo = color.value;
        });
    });
}




function storeNewBoard() {
    // Check if already created board exists

    let boardname = document.getElementById("board-modal-name").value.trim();
    let boarddescription = document.getElementById("board-modal-description").value.trim();

    if (!boardname || !boarddescription) return alert("Enter valid input")

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    if (currentBoardIndex !== -1) {
        boards[currentBoardIndex].boardName = boardname;
        boards[currentBoardIndex].boardDescription = boarddescription;
        boards[currentBoardIndex].boardLogo = boardlogo;

        updateTaskInDOM(currentBoardId, boardname, boarddescription, boardlogo, null);
        // Set the currentId and index to default
        currentBoardId = null;
        currentBoardIndex = -1;
    }
    else {

        const board = {
            boardId: `board-${boards.length}`,
            boardName: boardname,
            boardDescription: boarddescription,
            boardLogo: boardlogo,
            boardTasks: [],
        };

        boards.push(board);
    }



    updateLocalStorage();
    // localStorage.setItem("boards", JSON.stringify(boards));

    loadSaveBoards();
    hideBoardModal();

}


/* ------------------------ Creating A New Board Ends Here ------------------ */

// Updating local storage

function updateLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(boards));
}





/* ------------------------ Updating Board Ends Here ------------------ */

/* Creating A New Board */


document.querySelector('.task-modal-submit').addEventListener('click', storeNewTask);

let currentTaskId = null;
let currentTaskIndex = -1;
let draggedTask = null;


function storeNewTask() {

    let taskname = document.getElementById("task-modal-name").value.trim();
    let taskdescription = document.getElementById("task-modal-description").value.trim();

    if (!taskname || !taskdescription) return alert("Enter valid input");

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    function uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }
    

    if (currentTaskIndex !== -1) {
        boards[currentBoardIndex].boardTasks[currentTaskIndex].taskName = taskname;
        boards[currentBoardIndex].boardTasks[currentTaskIndex].taskDescription = taskdescription;

        updateTaskInDOM(currentTaskId, taskname, taskdescription, null, boards[currentBoardIndex].boardTasks.length);

        currentTaskIndex = -1;
        currentTaskId = null;
    }

    else {

        let Task = {
            taskId: `${boards[currentBoardIndex].boardId}-task-${uuidv4()}`,
            taskName: taskname,
            taskDescription: taskdescription
        }
        boards[currentBoardIndex].boardTasks.push(Task);
        updateTaskInDOM(currentBoardId, null, null, null, boards[currentBoardIndex].boardTasks.length)

    }

    updateLocalStorage();
    loadSavedTasks();
    hideTaskModal();
}


// Loading saved tasks in board


function loadSavedTasks() {

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    for (let i = 0; i < boards.length; i++) {

        for (let j = 0; j < boards[i].boardTasks.length; j++) {

            const taskId = boards[i].boardTasks[j] !== null ? boards[i].boardTasks[j].taskId : null;

            if (!taskId) continue;

            if (document.getElementById(`${taskId}`) || boards.length == 0) {
                continue;
            }

            const taskDiv = document.createElement("div");
            taskDiv.classList.add("single-task-item");
            taskDiv.setAttribute('id', boards[i].boardTasks[j].taskId);
            taskDiv.setAttribute('draggable', 'true');

            // Handling draggable or not



            taskDiv.addEventListener('dragstart', (event) => {
                draggedTask = {
                    indexTask: j,
                    indexBoard: i
                };
                taskDiv.classList.add('flying-item');

            })
            taskDiv.addEventListener('dragend', () => {
                taskDiv.classList.remove('flying-item');
                draggedTask = null;
            })









            const taskHeadingDiv = document.createElement("div");
            taskHeadingDiv.classList.add("single-task-heading");

            const taskLogoDiv = document.createElement("div");
            taskLogoDiv.classList.add("single-task-logo");

            const taskTypeDiv = document.createElement("div");
            taskTypeDiv.classList.add("single-task-type");
            taskTypeDiv.textContent = boards[i].boardTasks[j].taskName

            taskHeadingDiv.appendChild(taskLogoDiv);
            taskHeadingDiv.appendChild(taskTypeDiv);

            const taskEditDeleteDiv = document.createElement("div");
            taskEditDeleteDiv.classList.add("task-edit-delete");

            const editTaskImg = document.createElement("img");
            editTaskImg.setAttribute('src', './assets/edit-task-item.svg');
            editTaskImg.setAttribute('alt', 'edit-task');

            // Editing task 

            editTaskImg.addEventListener('click', () => {


                displayTaskModal();

                document.getElementById("task-modal-name").value = boards[i].boardTasks[j].taskName;
                document.getElementById("task-modal-description").value = boards[i].boardTasks[j].taskDescription;


                currentTaskIndex = j;
                currentBoardId = boards[i].boardId;
                currentBoardIndex = i;
                currentTaskId = boards[i].boardTasks[j].taskId;
            })

            const deleteTaskImg = document.createElement("img");
            deleteTaskImg.setAttribute('src', './assets/delete-task-item.svg');
            deleteTaskImg.setAttribute('alt', 'delete-task');


            deleteTaskImg.addEventListener('click', () => {

                boards[i].boardTasks.splice(j, 1);

                updateTaskInDOM(boards[i].boardId, null, null, null, boards[i].boardTasks.length);

                updateLocalStorage();
                loadSavedTasks();
                taskDiv.remove();
            });

            taskEditDeleteDiv.appendChild(editTaskImg);
            taskEditDeleteDiv.appendChild(deleteTaskImg);

            taskHeadingDiv.appendChild(taskEditDeleteDiv);

            taskDiv.appendChild(taskHeadingDiv);


            // Task contenet showing

            const taskDescriptionDiv = document.createElement("p");
            taskDescriptionDiv.classList.add("single-task-content");
            taskDescriptionDiv.textContent = boards[i].boardTasks[j].taskDescription;

            taskDiv.appendChild(taskDescriptionDiv);


            document.getElementById(`${boards[i].boardId}-task`).appendChild(taskDiv);


        }
    }


}





/* ------------------------ Updating Board Ends Here ------------------ */











// Rendering all saved boards
function loadSaveBoards() {

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    for (let i = 0; i < boards.length; i++) {

        if (document.getElementById(`${boards[i].boardId}`) || boards.length == 0) {
            continue;
        }

        const boardDiv = document.createElement("div");
        boardDiv.classList.add("board");
        boardDiv.setAttribute('id', boards[i].boardId);



        // Board Details

        const boardDetailsDiv = document.createElement('div');
        boardDetailsDiv.classList.add('board-details');

        // Board Name
        const boardHeadingDiv = document.createElement('div');
        boardHeadingDiv.classList.add('board-heading');

        const boardLogoDiv = document.createElement('div');
        boardLogoDiv.classList.add('board-logo');
        boardLogoDiv.style.border = `2px solid ${boards[i].boardLogo}`

        const boardNameDiv = document.createElement('p');
        boardNameDiv.classList.add('board-name');
        boardNameDiv.textContent = boards[i].boardName;

        const boardTaskStatusDiv = document.createElement('p');
        boardTaskStatusDiv.classList.add('board-task-status');
        boardTaskStatusDiv.textContent = boards[i].boardTasks.length;

        boardHeadingDiv.appendChild(boardLogoDiv);
        boardHeadingDiv.appendChild(boardNameDiv);
        boardHeadingDiv.appendChild(boardTaskStatusDiv);

        boardDetailsDiv.appendChild(boardHeadingDiv);

        // Board Description

        const boardDescriptionDiv = document.createElement('div');
        boardDescriptionDiv.classList.add('board-description');
        boardDescriptionDiv.textContent = boards[i].boardDescription;

        boardDetailsDiv.appendChild(boardDescriptionDiv);

        boardDiv.appendChild(boardDetailsDiv);



        /* Appending task section in board */
        const boardTaskItems = document.createElement('div');
        boardTaskItems.classList.add('board-task-items');
        boardTaskItems.setAttribute('id', `${boards[i].boardId}-task`);
        boardDiv.appendChild(boardTaskItems);


        boardDiv.addEventListener('dragover', (event) => {
            event.preventDefault();


        });

        boardDiv.addEventListener('drop', (event) => {
            event.preventDefault();

            if (draggedTask) {


                let indexTask = draggedTask.indexTask;
                let indexBoard = draggedTask.indexBoard;

                let task = boards[indexBoard].boardTasks.splice(indexTask, 1);
                // task[0].taskId = `${boards[i].boardId}-task-${boards[i].boardTasks.length}`;





                boards[i].boardTasks.push(task[0]);

                const flyingElement = document.querySelector('.flying-item');

                boardDiv.appendChild(flyingElement);
                updateLocalStorage();
            }

        });












        // Board Edit and Delete controls
        const addTaskItemDiv = document.createElement('div');
        addTaskItemDiv.classList.add('add-task-item');

        const addTaskBtnDiv = document.createElement('div');
        addTaskBtnDiv.classList.add('add-task-btn');





        // Diplaying task item modal
        addTaskBtnDiv.addEventListener('click', () => {

            boards = JSON.parse(localStorage.getItem('boards'));
            displayTaskModal();
            currentBoardId = boards[i].boardId;
            currentBoardIndex = i;

        });
        const addTaskImg = document.createElement('img');
        addTaskImg.setAttribute('src', './assets/add-task-item.svg');
        addTaskImg.setAttribute('alt', 'add task item');

        const addTaskPara = document.createElement('p');
        addTaskPara.textContent = 'Add item';

        addTaskBtnDiv.appendChild(addTaskImg);
        addTaskBtnDiv.appendChild(addTaskPara);

        addTaskItemDiv.appendChild(addTaskBtnDiv);


        const boardEditDelete = document.createElement('div');
        boardEditDelete.classList.add('board-edit-delete');

        // Edit board
        const editBoard = document.createElement('img');
        editBoard.setAttribute('src', './assets/edit-task-item.svg');
        editBoard.setAttribute('id', 'edit-board');

        editBoard.addEventListener('click', (event) => {

            displayBoardModal();
            boards = JSON.parse(localStorage.getItem('boards'));
            document.getElementById("board-modal-name").value = boards[i].boardName;
            document.getElementById("board-modal-description").value = boards[i].boardDescription;

            currentBoardId = boards[i].boardId;
            currentBoardIndex = i;
        })

        // Delete board
        const deleteBoard = document.createElement('img');
        deleteBoard.setAttribute('src', './assets/delete-task-item.svg');
        deleteBoard.setAttribute('id', 'delete-board');

        deleteBoard.addEventListener('click', deleteBoardMethod);

        function deleteBoardMethod() {
            boardDiv.remove();
            boards.splice(i, 1);
            updateLocalStorage();
        }

        boardEditDelete.appendChild(editBoard);
        boardEditDelete.appendChild(deleteBoard);

        addTaskItemDiv.appendChild(boardEditDelete);

        boardDiv.appendChild(addTaskItemDiv);

        document.querySelector("main").appendChild(boardDiv);
    }

}

loadSaveBoards();
loadSavedTasks();


/* ------------------------ Rendering all saved board Ends Here ------------------ */
