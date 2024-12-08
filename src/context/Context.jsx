import React, { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";
// import { extendContextWithSpeech } from './yourSpeechExtensionFile';

export const Context = createContext();

export const ContextProvider = (props) => {
    // All state definitions
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [chatTitles, setChatTitles] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [stopGeneration, setStopGeneration] = useState(false);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [controller, setController] = useState(null);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [chatSessions, setChatSessions] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    // Function to create a new chat session
    const createNewSession = async () => {
        const sessionId = `session_${Date.now()}`;
        setChatSessions(prev => ({
            ...prev,
            [sessionId]: {
                messages: [],
                recentPrompt: "",
                resultData: "",
                uploadedFile: null,
                chatTitle: ""
            }
        }));
        setCurrentSessionId(sessionId);
        return sessionId;
    };

    // Function to switch to an existing session
    const switchToSession = (sessionId) => {
        if (chatSessions[sessionId]) {
            const session = chatSessions[sessionId];
            setCurrentSessionId(sessionId);
            setRecentPrompt(session.recentPrompt);
            setResultData(session.resultData);
            setUploadedFile(session.uploadedFile);
            setShowResult(!!session.resultData);
        }
    };
    

    // Initialize with a first session on mount
    useEffect(() => {
        createNewSession();
    }, []);

    // Existing methods with modifications to support session management
    const generateChatTitle = async (prompt) => {
        try {
            const titlePrompt = `Generate a concise, descriptive title (max 5 words) for a conversation starting with: "${prompt}"`;
            const titleResponse = await runChat(titlePrompt);
            
            const cleanedTitle = titleResponse
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .trim()
                .split(' ')
                .slice(0, 5)
                .join(' ');

            return cleanedTitle || `Chat on ${new Date().toLocaleDateString()}`;
        } catch (error) {
            console.error("Error generating chat title:", error);
            return `Chat on ${new Date().toLocaleDateString()}`;
        }
    };

    const delayPara = async (word) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!stopGeneration) {
                    setResultData(prev => prev + word);
                }
                resolve();
            }, 50);
        });
    };

    const stopGenerating = () => {
        if (controller) {
            controller.abort();
            setStopGeneration(true);
            setIsGeneratingText(false);
            setLoading(false);
            setController(null);
        }
    };

    const newChat = () => {
        createNewSession();
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
        setUploadedFile(null);
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setStopGeneration(false);
        setIsGeneratingText(true);

        const newController = new AbortController();
        setController(newController);

        try {
            const currentHistory = chatSessions[currentSessionId]?.messages || [];
            let fileData = null;
            if (uploadedFile) {
                fileData = await readFileContent(uploadedFile);
            }

            let fullPrompt = prompt;
            if (fileData?.type === 'text') {
                fullPrompt += `\n\nAttached File Content:\n${fileData.content}`;
            }

            // Get the response stream
            const responseStream = await runChat(
                fullPrompt,
                fileData?.type === 'image' || fileData?.type === 'pdf' ? fileData.content : null,
                fileData?.mimeType,
                currentHistory.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : msg.role,
                    content: msg.content
                })),
                newController.signal
            );

            // Check if generation was stopped before processing
            if (stopGeneration) {
                throw new Error('Generation aborted');
            }

            let chatTitle = "";
            if (!recentPrompt) {
                chatTitle = await generateChatTitle(prompt);
                setChatTitles(prev => [chatTitle, ...prev.slice(0, 9)]);
            }

            setRecentPrompt(prompt);

            // Format and animate the response
            let formattedResponse = responseStream
                .split("**")
                .map((text, i) => i % 2 === 1 ? `<b>${text}</b>` : text)
                .join("");
            
            formattedResponse = formattedResponse.split("*").join("<br>");
            const words = formattedResponse.split(" ");

            // Animate word by word
            for (const word of words) {
                if (stopGeneration) {
                    throw new Error('Generation aborted');
                }
                await delayPara(word + " ");
            }

            // Only update chat session if generation completed
            if (!stopGeneration) {
                setChatSessions(prev => ({
                    ...prev,
                    [currentSessionId]: {
                        ...prev[currentSessionId],
                        messages: [
                            ...currentHistory,
                            { role: 'user', content: prompt },
                            { role: 'model', content: responseStream }
                        ],
                        recentPrompt: prompt,
                        resultData: formattedResponse,
                        uploadedFile,
                        chatTitle: chatTitle || prev[currentSessionId]?.chatTitle
                    }
                }));
            }

        } catch (error) {
            if (error.message === 'Generation aborted') {
                console.log('Generation was stopped by user');
                setResultData(prev => prev + "\n[Generation stopped by user]");
            } else {
                console.error("Error getting response:", error);
                setResultData("Sorry, there was an error getting the response.");
            }
        } finally {
            setLoading(false);
            setInput("");
            setController(null);
            setIsGeneratingText(false);
        }
    };

    // Existing file handling methods remain the same
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Existing file validation logic
            const maxSize = 5 * 1024 * 1024; 
            const allowedTypes = [
                'image/jpeg', 
                'image/png', 
                'image/gif', 
                'application/pdf', 
                'text/plain', 
                'text/csv', 
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            if (file.size > maxSize) {
                alert('File is too large. Maximum size is 5MB.');
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Allowed types are: JPEG, PNG, GIF, PDF, Text, CSV, Word files.');
                return;
            }

            setUploadedFile(file);

            // Update current session's uploaded file
            if (currentSessionId) {
                setChatSessions(prev => ({
                    ...prev,
                    [currentSessionId]: {
                        ...prev[currentSessionId],
                        uploadedFile: file
                    }
                }));
            }
        }
    }

    // Read file content method remains the same
    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const content = event.target.result;
                
                // Determine content type and processing
                if (file.type.startsWith('image/')) {
                    resolve({
                        type: 'image',
                        content: content,
                        mimeType: file.type
                    });
                } else if (file.type === 'application/pdf') {
                    resolve({
                        type: 'pdf',
                        content: content,
                        mimeType: file.type
                    });
                } else if (
                    file.type.includes('spreadsheet') || 
                    file.type.includes('word') || 
                    file.type === 'text/csv' || 
                    file.type === 'text/plain'
                ) {
                    resolve({
                        type: 'text',
                        content: content,
                        mimeType: file.type
                    });
                } else {
                    reject(new Error('Unsupported file type'));
                }
            };

            reader.onerror = (error) => reject(error);
            
            // Choose appropriate reading method
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    // Get recent chat sessions
    const getRecentChats = () => {
        return Object.entries(chatSessions)
            .map(([id, session]) => ({
                id,
                title: session.chatTitle || session.recentPrompt || `Chat on ${new Date(parseInt(id.split('_')[1])).toLocaleDateString()}`,
                date: new Date(parseInt(id.split('_')[1]))
            }))
            .filter(chat => chat.title)
            .sort((a, b) => b.date - a.date)
            .slice(0, 10);
    };

    const contextValue = {
        ...{
            prevPrompts,
            setPrevPrompts,
            onSent,
            recentPrompt,
            setRecentPrompt,
            showResult,
            loading,
            resultData,
            input,
            setInput,
            newChat,
            handleFileUpload,
            uploadedFile,
            setUploadedFile,
            chatTitles,
            setChatTitles,
            stopGenerating, // Add the stop generating function
        },
        // New session management methods
        currentSessionId,
        chatSessions,
        createNewSession,
        switchToSession,
        getRecentChats,
        isGenerating,
        generatedText
    }
 
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;