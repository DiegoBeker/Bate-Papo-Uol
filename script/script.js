const list = document.querySelector('.messages');
const inputEle = document.getElementById('enter');
let messages;
let members;
let user;
let to = 'Todos';
let messageType = 'Público';
let type;
inputEle.addEventListener('keyup', function(e){
    var key = e.which || e.keyCode;
    if (key == 13) {
      sendMessage();
    }
  });

function loadMessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    messages = "";
    promise.then(showMessages);
    promise.catch();
}

function showMessages(response) {
    for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].type === 'status') {
            messages += `
                <li data-test="message" class="join-left">
                    <p>
                        <span>${response.data[i].time}</span>  
                        <b class="name">${response.data[i].from}</b>
                        ${response.data[i].text}
                    </p>
                 </li>
            `;
        } else {
            if (response.data[i].to ==='Todos') {
                messages += `
                    <li data-test="message" class="public-message">
                        <p>
                            <span>${response.data[i].time}</span>  
                            <b class="name">${response.data[i].from}</b> para 
                            <b class="name">${response.data[i].to}</b>:  
                            ${response.data[i].text}
                        </p>
                    </li>
                `;
            }
            if (response.data[i].type === 'private_message' && (response.data[i].to === user || response.data[i].from === user)) {
                    messages += `
                <li data-test="message" class="private-message">
                    <p>
                        <span>${response.data[i].time}</span>  
                        <b class="name">${response.data[i].from}</b> reservadamente para 
                        <b class="name">${response.data[i].to}</b>:  
                        ${response.data[i].text}
                    </p>
                </li>
                `;
            }
        } 
    }
    scrollToLatest();
}
function scrollToLatest() {
    if (list.innerHTML !== messages) {
        list.innerHTML = messages;
        const latest = document.querySelector('li:last-child');
        if (latest != null) {
            latest.scrollIntoView();
        }
    }
}

function verifyName() {
    user = prompt('Qual o seu nome?');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: user });
    promise.then(joinChat);
    promise.catch(catchName);
}

function joinChat() {
    const updateTime = 3000;
    const keepTime = 5000;
    loadMessages();
    loadMembers();
    setInterval(keepConnected, keepTime);
    setInterval(loadMessages, updateTime);
    setInterval(loadMembers, (2 * keepTime));
}

function catchName(response) {
    alert('Nome ja existe ou é invalido');
    const badRequest = 400;
    if (response.request.status === badRequest) {
        verifyName();
    }
}

function keepConnected() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: user });
    promise.then();
    promise.catch();
}

function sendMessage() {
    const text = document.querySelector('input');
    if(messageType === 'Público')
        type = 'message';
    if(messageType === 'Reservadamente')
        type = 'private_message';
    const message = {
        from: `${user}`,
        to: `${to}`,
        text: text.value,
        type: `${type}`
    };
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message);
    promise.then(messageSuccessful);
    promise.catch(messageFailed);
}

function messageSuccessful() {
    document.querySelector('input').value = '';
    loadMessages();
}

function messageFailed() {
    window.location.reload();
}

function openMembers(){
    const button = document.querySelector('.hide');
    if(button !== null){
        button.classList.add('window');
        button.classList.remove('hide');
        
    }
}

function closeMembers(){
    const area = document.querySelector('.window');
    if(area !== null){
        area.classList.add('hide');
        area.classList.remove('window');
    }
}

function select(section,element){
    const type = document.querySelector(section);
    const previouslySelected = type.querySelector('.selected');
    if(previouslySelected !== null){
        previouslySelected.classList.remove('selected');
    }
    element.querySelector('.check').classList.add('selected');
    if(section === '.members'){
        to = element.querySelector('p').textContent;
        document.querySelector('.input-container p').innerHTML = `Enviando para ${to} (${messageType})`;
    }
    if(section === '.visibility'){
        messageType = element.querySelector('p').textContent;
        document.querySelector('.input-container p').innerHTML = `Enviando para ${to} (${messageType})`;
    }
    
}

function loadMembers(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    members = `
        <li data-test="all" class="member" onclick="select('.members',this)">
            <div>
                <ion-icon class="icon" name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon data-test="check" class="check" name="checkmark"></ion-icon>
        </li>
    `;

    promise.then(updateMembers);
}

function updateMembers(response){
    const membersList = document.querySelector('.members');
    for (let i = 0; i < response.data.length; i++) {
        members += `
                <li data-test="participant" class="member" onclick="select('.members',this)">
                    <div>
                        <ion-icon class="icon" name="person"></ion-icon>
                        <p>${response.data[i].name}</p>
                    </div>
                    <ion-icon data-test="check" class="check" name="checkmark"></ion-icon>
                </li>
        `;
    }
    membersList.innerHTML = members;
}

verifyName();