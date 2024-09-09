Sure! Below is an example of a simple web component for a button using HTML, CSS, and JavaScript. This example defines a custom element `<custom-button>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Button Web Component</title>
</head>
<body>
  <custom-button></custom-button>

  <script>
    class CustomButton extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const button = document.createElement('button');
        button.textContent = 'Click Me';

        const style = document.createElement('style');
        style.textContent = `
          button {
            background-color: #6200ea;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
          }
          button:hover {
            background-color: #3700b3;
          }
        `;

        shadow.appendChild(style);
        shadow.appendChild(button);
      }
    }

    customElements.define('custom-button', CustomButton);
  </script>
</body>
</html>
```

This code defines a custom button component with some basic styles. When you include `<custom-button></custom-button>` in your HTML, it will render a styled button. You can further customize this component by adding attributes, methods, or more complex styles and behaviors.