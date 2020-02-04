// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID, message}) {
    // debugger;
    // testing in multiple browsers, you will have different IDs
    // console.log(packet);

    vm.socketID = sID;
}

function runDisconnectMessage(packet) {
    debugger;
    console.log(packet);
}

function appendNewMessage(msg) {
    // take the incoming message and push it into the Vue instance
    // into the messages array
    vm.messages.push(msg);
}

// this is our main Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickName: ""
    },

    methods: {
        // catches the information the user passes in, vue is magical
        // using two way binding
        dispatchMessage() {
            //emit a message event and sent the message to the server
            console.log('handle send message');
            socket.emit('chat_message', {
                content: this.message,
                // || = shorthand for or operator (called a double pipe operator)
                // if this.nickName is not set, put "anonymous"
                name: this.nickName || "anonymous"
            })
            // resets message after it sends
            this.message = "";
        }  
    },

    components: {
        // newmessage = internal variable name, could name it anything
        // use the component when you reference it with newmessage in the markup
        // custom element
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
    
}).$mount("#app");

// event handling -> these events come from the server
// emits are in app.js ('______, function')
socket.addEventListener('connected', setUserId);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);