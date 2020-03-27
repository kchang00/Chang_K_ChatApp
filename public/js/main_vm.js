// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();
    //   subBtn = document.getElementById('subBtn');

function setUserId({sID}) {
    // debugger;
    // testing in multiple browsers, you will have different IDs
    // pass in sID into vue socketID
    vm.socketID = sID;
    console.log(sID, '(you) joined');
}

function runConnectionMessage(packet) {
    // debugger;
    console.log(packet);
}

// pass in data from ChatMessage.js props
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
        nickName: "",
        typing: false,
        connections: 0,
    },

    // vue created method
    created() {
        // Listening to typing event emitted from the server and setting the data (nickname) to the UI
        socket.on('typing', (data) => {
            this.typing = data;
        })

         // Listening to stopTyping event emitted from the server and setting the typing property to false
        socket.on('stopTyping', () => {
            this.typing = false;
        })

        socket.on('connections', (data) => {
            this.connections = data;
        })
    },

    // vue watch hook
    watch: {
            
        // watching for changes in the message textarea and emitting the 'typing' or 'stopTyping' event
        message(value) {
            value ? socket.emit('typing', this.nickName || "anonymous") : socket.emit('stopTyping')
        }
    },

    methods: {
        // catches the information the user passes in, vue is magical
        // using two way binding
        dispatchMessage() {
            //emit a message event and sent the message to the server
            // console.log('handle send message');
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

// function submitOnEnter(event){
//     if(event.which === 13 && !event.shiftKey){
//         debugger;
//         event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
//         event.target.dispatchEvent();
//     }
// }

// event handling -> these events come from the server
// emits are in app.js ('______, function')
// listening for custom events tracked and fired by socket.io (similar to listening for a click)
socket.addEventListener('connected', setUserId);
socket.addEventListener('user_disconnect', runConnectionMessage);
socket.addEventListener('user_connect', runConnectionMessage);
socket.addEventListener('new_message', appendNewMessage);
// subBtn.addEventListener('keypress', submitOnEnter);