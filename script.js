// Dark mode code 
let switchTheme = document.querySelector('.switch-theme');

let darkmodeStatus = localStorage.getItem('darkmode');

if(darkmodeStatus === 'active') {
    enableDarkMode();
}


function enableDarkMode() {
    document.querySelector('body').classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
    switchTheme.style.backgroundImage = `url(./assets/light-mode.svg)`
}

function disableDarkMode() {
    document.querySelector('body').classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
    switchTheme.style.backgroundImage = `url(./assets/dark-mode.svg)`
}
switchTheme.addEventListener('click', () => {
    darkmodeStatus = localStorage.getItem('darkmode')
    darkmodeStatus !== 'active' ? enableDarkMode() : disableDarkMode();
})


/* -------------------------- Dark Mode Ends Here -------------------------- */


// Modal Displaying

const addNewBoard = document.querySelector('.add-new-board');
const modal = document.querySelector('.modal');

function hideModalVisibility() {
    modal.style.display = 'none';
}
// Hide modal 
document.querySelector('.cancel').addEventListener('click', hideModalVisibility)
document.querySelector('.close').addEventListener('click', hideModalVisibility)

// Display modal
addNewBoard.addEventListener('click', displayModal)

function displayModal() {
    modal.style.display = 'block';
}
