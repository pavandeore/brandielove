window.onload = function() {

    MicroModal.init();

    let loading = document.getElementById('loading');
    let chatBox = document.getElementById('chatbox');
    let chatInput = document.getElementById('chatinput');
    let sendButton = document.getElementById('sendbutton');
    // let key = document.getElementById('key');
    // let keySubmit = document.getElementById('key-submit');  

    // if(localStorage.getItem('_key')) {
    //     key.value = localStorage.getItem('key');
    // }else{
    //     MicroModal.show('key-modal');
    // }

    // keySubmit.addEventListener('click', function() {
    //     MicroModal.close('key-modal');
    //     if(!key.value) {
    //         alert('Please enter a valid key');
    //         return;
    //     }
    //     localStorage.setItem('_key', key.value)
    // });

    MicroModal.show('key-modal');

    let initialReply = 'Hello, I am Brandie. What can I do for you today?';

    function createChatElement(reply = initialReply, isYou = false) {
        let chat = document.createElement('div');
        chat.innerHTML = `
            ${!isYou ? `<img src="./brandie.jpeg" height="50" width="50" alt="Brandie" class="rounded-lg" />` : ''}
            <div>
                <span class="text-gray-800 font-bold"> ${!isYou ? 'Brandie' : 'You'}</span> <br/>
                <p class="font-light">
                    ${reply}
                </p>
            </div>
        `;
        return chat;
    }

    chatBox.appendChild(createChatElement(initialReply, false));
    chatInput.focus();

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendReply();
        }
    });

    sendButton.addEventListener('click', function() {
        sendReply();
    });

    function sendReply() {
        let reply = chatInput.value;

        if (!reply) {
            alert('Please enter a message');
            chatInput.focus();
            return;
        }

        loading.style.display = 'block';

        chatBox.appendChild(createChatElement(reply, true));
        chatInput.value = '';


        getResponseFromGf(reply);
    }

    function scrollToBottom() {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }


    function getResponseFromGf(inputs) {
        let apiKey = localStorage.getItem('_key') || null;

        const data = {
            inputs
        };

        if(apiKey){
            data.key = apiKey;
        }

        fetch('http://localhost:9005/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            chatBox.appendChild(createChatElement(data.reply, false));
            scrollToBottom();
        })
        .catch(error => {
            console.error(error);
            alert('Failed to get response from the server');
        });
    }

}