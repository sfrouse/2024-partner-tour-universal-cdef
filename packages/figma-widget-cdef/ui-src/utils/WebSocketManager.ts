
type MessageListener = (event: MessageEvent) => void;

export default class WebSocketManager {
    private ws: WebSocket;
    private listeners: Set<MessageListener>;
  
    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.listeners = new Set();
  
        // Handle WebSocket onmessage event
        this.ws.onmessage = (event: MessageEvent) => {
            // Call each listener with the event data
            this.listeners.forEach((listener) => listener(event));
        };

        this.ws.onopen = () => {
          console.log('Connected to the WebSocket server');
        };

        this.ws.onclose = () => {
            console.log('Disconnected from the WebSocket server');
        };
    }
  
    // Add a new listener to the onmessage event
    addListener(listener: MessageListener): void {
        this.listeners.add(listener);
    }
  
    // Remove a listener from the onmessage event
    removeListener(listener: MessageListener): void {
        this.listeners.delete(listener);
    }
}