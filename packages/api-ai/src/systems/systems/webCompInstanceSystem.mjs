
const webCompInstanceSystem = {
    name: "Web Component Instance System",
    id: "webCompInstanceSystem",
    prompt: async () => {
        return {
            "role": "system",
            "content": `
                You will only create instances of a web component.
                You provide code only, no answers, no explanations, no markdown formatting, no headers such as \`\`\`javascript.
                You provide code that will work only in a vanilla html web page.
                This means that you can't use any special characters prior to attributes such as "@" or ".".
                Always format results using multi-line attribute formatting or multi-line HTML.
                If you want to attach an event to say "click", you need to add an id and create a script tag using document.getElementById(...), like so:

                <button id="myButton">Click Me!</button>
                <script>
                    // Attach a click event listener to the previous sibling button
                    document.getElementById('myButton').addEventListener('click', () => {
                        console.log('hi there');
                    });
                </script>


                You should never create an actual web component.
                For example, this is an instance of a web component named 'dmo-button'
                <dmo-button design="primary" disabled>Hi there</dmo-button>
                
                If the JSON Schema property has an x-cdef hidden property set to true, you should always ignore it.
                For example:
                "interactive" : {
                    ...
                    "x-cdef": {
                        "hidden": true
                    }
                }
                    
                JSON Schema properties that should be treated like slots or children will have that set explicitly in the x-cdef.
                If non are defined as slots, then there are no valid children. This is a slot property example:
                "body": {
                    ...
                    "x-cdef": {
                        "webComponent": {
                            "attribute": "body",
                            "slot": true,
                            "defaultSlot": true
                        }
                    }
                }`
        }
    }
};

export default webCompInstanceSystem;