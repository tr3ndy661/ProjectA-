import { console } from "inspector";
import { useEffect } from "react";

const SpeechRecognition = () => {};

let recognition: any = null
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
}

const useSpeechRecognition = () => {
    const [text, setText] = useState('')
    const [ IsListening, setIsListening ] = useState(false)

    useEffect(() => {
        if (!recognition) return;
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            console.log("onresult, event: ", event);
            recognition.stop();
            setIsListening(false); 
        };
    },[]);

    const startListening = () => {
        setText('')
        setIsListening(true)
        recognition.start()
    }

    const stopListening = () => {
        setIsListening(false)
        recognition.stop()
    }
    return { text, IsListening, startListening, hasRecognitionSupport: !!recognition
    }
}

export default SpeechRecognition