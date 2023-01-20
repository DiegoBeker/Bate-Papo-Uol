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
    let latest;
    
    for (let i = 0; i < response.data.length; i++) {
        if(i == (response.data.length - 1)){
            latest = ' latest';
        }else{
            latest = '';
        }
        
        if (response.data[i].type == 'status') {
            messages += `
                <li class="join-left${latest}">
                    <p>
                        <span>${response.data[i].time}</span>  
                        <b class="name">${response.data[i].from}</b>
                        ${response.data[i].text}
                    </p>
                 </li>
            `
        }
        if (response.data[i].type == 'message') {
            if (response.data[i].to == 'Todos') {
                messages += `
                    <li class="public-message${latest}">
                        <p>
                            <span>${response.data[i].time}</span>  
                            <b class="name">${response.data[i].from}</b> para 
                            <b class="name">${response.data[i].to}</b>:  
                            ${response.data[i].text}
                        </p>
                    </li>
                `
            }
        }
        if (response.data[i].type == 'private_message') {
            if (response.data[i].to == user || response.data[i].from == user) {
                messages += `
                <li class="private-message${latest}">
                    <p>
                        <span>${response.data[i].time}</span>  
                        <b class="name">${response.data[i].from}</b> para 
                        <b class="name">${response.data[i].to}</b>:  
                        ${response.data[i].text}
                    </p>
                </li>
                `
            }
        }
    }
    
    if(list.innerHTML != messages){
        list.innerHTML = messages;
        const last = document.querySelector('.latest');
        if(last != null){
            last.scrollIntoView();
        }
    }
    
}

function verifyName() {
    user = prompt('Qual o seu nome?');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: user });
    promise.then(joinChat);
    promise.catch();
}

function joinChat(response) {
    loadMessages();
    setInterval(keepConnected, 5000);
    setInterval(loadMessages, 3000);
}

function catchName(response) {
    alert('erro');
    console.log(response);
}

function keepConnected() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: user });
    promise.then();
    promise.catch();
}

function sendMessage() {
    const text = document.querySelector('input');
    let message = {
        from: `${user}`,
        to: "Todos",
        text: text.value,
        type: "message"
    };
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message)
    promise.then(messageSuccessful);
    promise.catch(messageFailed);
}

function messageSuccessful(response) {
    document.querySelector('input').value = '';
    loadMessages();
}

function messageFailed(response) {
    console.log(response);
    //window.location.reload();
}

verifyName();