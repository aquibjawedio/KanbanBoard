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
}

/* -------------------------- Board Modal Ends Here -------------------------- */










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
    let boarddescription = document
        .getElementById("board-modal-description")
        .value.trim();

    if(!boardname || !boarddescription) return alert("Enter valid input")

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    if (currentBoardIndex !== -1) {
        boards[currentBoardIndex].boardName = boardname;
        boards[currentBoardIndex].boardDescription = boarddescription;
        boards[currentBoardIndex].boardLogo = boardlogo;

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
            boardTasks: ["Task1", "Task3", "Task2"],
        };

        boards.push(board);
    }



    localStorage.setItem("boards", JSON.stringify(boards));

    // const taskItem = {
    //     itaskId: `${board.boardId}-task-${board.boardTasks.length}`,
    //     taskName: "something",
    //     taskDescription: "Nothing"
    // }


    // document.getElementById("board-modal-name").value = "";
    // document.getElementById("board-modal-description").value = "";

    hideBoardModal();
    loadSaveBoards();

}


/* ------------------------ Creating A New Board Ends Here ------------------ */

// Updating local storage

function updateLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(boards));
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









        // Board Edit and Delete controls
        const addTaskItemDiv = document.createElement('div');
        addTaskItemDiv.classList.add('add-task-item');

        const addTaskBtnDiv = document.createElement('div');
        addTaskBtnDiv.classList.add('add-task-btn');

        addTaskBtnDiv.addEventListener('click', displayTaskModal)

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
            boards = JSON.parse(localStorage.getItem('boards')).filter(board => {
                return board.boardId != boardDiv.id;
            })
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

setInterval(() => {
    console.log(currentBoardId);
    console.log(currentBoardIndex);

}, 3000)

/* ------------------------ Rendering all saved board Ends Here ------------------ */
