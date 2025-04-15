import React, { useState, useEffect } from 'react';
import './GameChat.css';
import io from 'socket.io-client';
import messageSound from '../../../sounds/message.mp3';

const GameChat = ({ room, user }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        const audio = new Audio(messageSound);

        newSocket.emit('joinRoom', room);

        newSocket.on('message', (data) => {
            audio.play();
            setMessages(prevMessages => [...prevMessages, {
                sender: data.sender,
                message: data.message
            }]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [room]);

    const sendMessage = () => {
        const sender = JSON.parse(localStorage.getItem('user')).username;
        if (input.trim() !== '' && socket) {
            const messageData = {
                room,
                message: input,
                sender
            };

            socket.emit('message', messageData);

            setMessages(prevMessages => [...prevMessages, messageData]);
            setInput('');
        }
    };

    return (
        <div className="chat">
            <div className="chatMessages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div className="chatInput">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GameChat;
