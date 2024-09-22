let recognition;

export default function startVoiceRecognition(
    setTranscript,
    isRecording,
    setIsRecording
) {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Sorry, your browser does not support speech recognition.');
        return;
      }
  
      recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false; // Don't display interim results
      recognition.maxAlternatives = 1;
      recognition.continuous = true; // Keep recognizing until manually stopped
  
      recognition.onresult = (event) => {
        const speechResult = event.results[event.results.length - 1][0].transcript;
        // setTranscript((prevTranscript) => prevTranscript + ' ' + speechResult); // Append new text to the previous one
        setTranscript(speechResult);
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error: ', event.error);
      };
  
      recognition.onend = () => {
        console.log('Speech recognition service disconnected');
        if (isRecording) {
          recognition.start(); // Automatically restart if still recording
        }
      };
  
      recognition.start(); // Start listening
      setIsRecording(true);
};

export function stopVoiceRecognition (
    setIsRecording
) {
    if (recognition) {
      recognition.stop(); // Stop listening
      setIsRecording(false);
      recognition = null;
    }
};
