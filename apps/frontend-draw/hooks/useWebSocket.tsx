// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Create WebSocket connection
        socketRef.current = new WebSocket(url);

        // Connection opened
        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        // Listen for messages
        socketRef.current.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        // Handle errors
        socketRef.current.onerror = (event) => {
            setError(`WebSocket error: ${event}`);
        };

        // Cleanup on unmount
        return () => {
            socketRef.current?.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return { messages, error, sendMessage };
};

export default useWebSocket;
