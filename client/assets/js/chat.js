var connectionStatus = document.querySelector('#status');
var messageSection = document.querySelector('#message-section');
var form = document.querySelector('#formMessage');
var user = document.querySelector('#actualUser');
var message = document.querySelector('#actualMessage');

var data = {
    user: 'Anônimo',
    text: null,
    ws: null
};

var serverAdress = window.prompt('Insira o endereço do servidor abaixo, sem porta:','xxx.xxx.xxx.xxx');

var connection = {
    open: () => {
        data.ws = new WebSocket('ws://'+serverAdress+':8080');

        data.ws.onopen = (e) => {
            connectionStatus.innerHTML = `<p>Status da conexão: <span class="badge ${(e.type === 'open') ? 'badge-success' : 'badge-danger'}">${e.type}</span></p>`;
        };

        data.ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            let textNode = document.createElement('p');
            let content = `<span class="text-muted"><small>[${data.date}] ${data.user}: </small></span>${data.text}`;

            textNode.innerHTML = content;

            messageSection.appendChild(textNode);
        };
    },
    addMessage: (content) => {
        data.user = content.user;
        data.text = content.text;
    },
    sendMessage: (content) => {
        connection.addMessage(content);

        data.ws.send(JSON.stringify(content));

        data.text = null;
    }
};

connection.open();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let content = {
        user: form.elements['actualUser'].value,
        text: form.elements['actualMessage'].value
    };

    if (content.user.length == 0) content.user = data.user; 

    connection.sendMessage(content);

    message.value = null;

    toBottom();
});

function toBottom() {
    messageSection.scrollTop = messageSection.scrollHeight;
}
