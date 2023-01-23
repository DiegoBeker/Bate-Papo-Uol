const list = document.querySelector('.messages');
let messages;
let user;

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
                        <b class="name">${response.data[i].from}</b> para 
                        <b class="name">${response.data[i].to}</b>:  
                        ${response.data[i].text}
                    </p>
                </li>
                `;
            }
        }
        scrollToLatest();
    }
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
    setInterval(keepConnected, keepTime);
    setInterval(loadMessages, updateTime);
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
    const message = {
        from: `${user}`,
        to: "Todos",
        text: text.value,
        type: "message"
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

verifyName();