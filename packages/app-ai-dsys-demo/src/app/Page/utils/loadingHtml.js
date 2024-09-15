export const loadingHtml = `<style>
        body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Arial', sans-serif;
        background-color: #F9F9F9;
        }

        .loading-text {
        font-size: 14px;
        color: #333;
        }
    </style>
    <div class="loading-text">Loading...</div>`;

export const loadingHtmlDark = `<style>
        .loading-text-container {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0; right: 0; left: 0; bottom: 0;
        }

        .loading-text {
            font-size: 14px;
            color: #eee;
        }
        </style>
        <div class="loading-text-container">
            <div class="loading-text">Loading...</div>
        </div>`;

