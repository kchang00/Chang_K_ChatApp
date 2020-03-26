// the export statement means that everything inside the curly braces 
// will be made public when you import this file into another via the import statement

// same as Vue.component, wraps stuff up to be imported into main_vm.js
export default {
    props: ['msg'],
    template: `
        <div class="new-message" :class="{ 'my-message' : matchedID }">
            <p class="message-name">{{msg.message.name}}</p>
            <p class="message-content">{{msg.message.content}}</p>
        </div>
    `,
    
    data: function() {
        // nothing here yet
        return {
            matchedID: this.$parent.socketID == this.msg.id
        }
    }
}