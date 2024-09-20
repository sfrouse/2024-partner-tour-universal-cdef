
export default function getWebSocketStatusColor(websocketStatus: string) {
    switch (websocketStatus) {
        case 'connected':
            return '#B0E8B9';
        case 'connecting':
            return 'yellow';
        case 'disconnected':
        default:
            return 'red';
    }
};