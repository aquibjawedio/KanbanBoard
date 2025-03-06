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
    document.querySelector(".task-modal").style.display = "block";
    hideBoardModal();
}

function hideTaskModal() {
    document.querySelector(".task-modal").style.display = "none";
}

/* -------------------------- Board Modal Ends Here -------------------------- */

/* Creating A New Board */

let boards = [];

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

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    const board = {
        boardId: `board-${boards.length}`,
        boardName: boardname,
        boardDescription: boarddescription,
        boardLogo: boardlogo,
        boardTasks: ["task items will be stored here"],
    };

    boards.push(board);

    localStorage.setItem("boards", JSON.stringify(boards));

    // const taskItem = {
    //     itaskId: `${board.boardId}-task-${board.boardTasks.length}`,
    //     taskName: "something",
    //     taskDescription: "Nothing"
    // }

    console.log(JSON.parse(localStorage.getItem("boards")));

    document.getElementById("board-modal-name").value = "";
    document.getElementById("board-modal-description").value = "";

    hideBoardModal();

    loadSaveBoards();
}


/* ------------------------ Creating A New Board Ends Here ------------------ */


// Rendering all saved boards
function loadSaveBoards() {

    boards = JSON.parse(localStorage.getItem("boards")) || [];

    for(let i = 0; i < boards.length; i++) {
        if (document.getElementById(`${boards[i].boardId}`) || boards.length == 0) {
            continue;
        }
    
        const boardDiv = document.createElement("div");
        boardDiv.classList.add("board");
        boardDiv.setAttribute('id', boards[i].boardId);
    
        document.querySelector("main").appendChild(boardDiv);
    }

}

loadSaveBoards();


console.log(boards[0].boardId);

/* ------------------------ Rendering all saved board Ends Here ------------------ */
