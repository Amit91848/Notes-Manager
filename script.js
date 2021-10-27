const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.rmv-btn');
const modal = document.querySelector('.modal-container');
const main = document.querySelector('.main-container');
const ticketText = document.querySelector('.textarea-container');
const modalPriorityColor = document.querySelectorAll('.modal-priority')
const toolBoxColor = document.querySelectorAll('.color');


let storageObj = JSON.parse(localStorage["jira-tickets"]);
let ticketColor = 'black';
let rmvFlag = false;
const lockClass = "fa-lock";
const unlockClass = "fa-lock-open";
let colors = ['lightpink', 'lightblue', 'lightgreen', 'black'];
let ticketsArr = [];
let filterFlag = false;

function storageTickets() {
    const ticketContainer = main.querySelectorAll('.ticket-container');
    if(storageObj.length != 0) {
        for(let i = 0; i < storageObj.length; i++) {
            createTicket(storageObj[i].text, storageObj[i].ticketColor, storageObj[i].id);
        }
    }
    
}

function createTicket(text, ticketColor , ticketId) {
    let id = ticketId || createTicketId();
    const ticketContainer = document.createElement('div');
    ticketContainer.setAttribute('class', `ticket-container`);
    ticketContainer.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="ticket-area">${text}</div>
        <div class="ticket-lock">
                <i class="fas fa-lock"></i>
            </div>
    `
    ticketText.value = '';

    if(!ticketId) {
        ticketsArr.push({ticketColor, id, text});
        localStorage.setItem("jira-tickets", JSON.stringify(ticketsArr));
    }

    main.appendChild(ticketContainer);
    handleRemoval(ticketContainer);
    handleLock(ticketContainer);
    handleColor(ticketContainer);
}

function handleRemoval(ticket) {
    if(rmvFlag) ticket.remove();
}

function handleLock(ticket) {
    const ticketLock = document.querySelector('.ticket-lock');
    const textArea = document.querySelector('.ticket-area');
    const ticketLockIcon = ticketLock.firstElementChild;

    ticketLock.addEventListener('click', (e) => {
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass);
            ticketLockIcon.classList.add(unlockClass);

            textArea.setAttribute('contenteditable', 'true');
        } else {
            ticketLockIcon.classList.remove(unlockClass);
            ticketLockIcon.classList.add(lockClass);

            textArea.setAttribute('contenteditable', 'false');
        }
    })
}

function handleColor(ticket) {
    const ticketColor = ticket.querySelector('.ticket-color');
    ticketColor.addEventListener('click', (e) => {
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx;
        for(let i = 0; i < colors.length; i++){
            if(colors[i] == currentTicketColor) currentTicketColorIdx = i;
        }
        currentTicketColorIdx++;
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(colors[currentTicketColorIdx % 4]);
        
        
        const ticketIdForColorChange = ticket.children[1].innerHTML;
        for(let i = 0; i < ticketsArr.length; i++){
            if(ticketIdForColorChange.substring(1) == ticketsArr[i].id){
                ticketsArr[i].ticketColor = colors[currentTicketColorIdx % 4];
            }
        }
    })
}

function closeModal() {
    modal.classList.toggle('close')
}

function createTicketId() {
    let id = '';
    let idArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(let i = 0; i < 6; i++) {
        id += idArr[Math.floor(Math.random() * idArr.length)];
    }
    return id;
}

function checkForLocalStorage() {

}

addBtn.addEventListener('click', (e) => {
    closeModal();
});

removeBtn.addEventListener('click', (e) => {
    rmvFlag = !rmvFlag;
})

window.addEventListener('keydown', (e) => {
    if(!modal.classList.contains('close')){
        if(e.key == 'Shift'){
            createTicket(ticketText.value, ticketColor);
            ticketColor = 'black';
            closeModal();
            const selectedColor = modal.querySelector('.selected');
            selectedColor.classList.remove('selected');
            const blackPriorityColor = modal.querySelector('.black');
            blackPriorityColor.classList.add('selected');
        }
        if(e.key == 'Escape') {
            closeModal();
        }
    }
});

modalPriorityColor.forEach((color, idx) => {
    color.addEventListener('click', (e) => {
        modalPriorityColor.forEach((modalColor, idx) => {
            modalColor.classList.remove('selected');
        });
        color.classList.add('selected');
        ticketColor = color.classList[0];
    })
});

toolBoxColor.forEach((color) => {
    color.addEventListener('click', (e) => {
        let requiredTicketColor = color.classList[0];
        
        let filteredTickets = ticketsArr.filter((ticket) => {
            return requiredTicketColor == ticket.ticketColor;
        });

        let allTicketsContainer = document.querySelectorAll('.ticket-container');
        allTicketsContainer.forEach((ticket) => {
            ticket.remove();
        });

        filteredTickets.forEach((ticket) => {
            createTicket(ticket.text, ticket.ticketColor, ticket.id);
        })
    });

    color.addEventListener('dblclick', (e) => {
        let allTicketsContainer = document.querySelectorAll('.ticket-container');
        allTicketsContainer.forEach((ticket) => {
            ticket.remove();
        });

        ticketsArr.forEach((ticket) => {
            createTicket(ticket.text, ticket.ticketColor, ticket.id);
        })
    })
})

storageTickets();