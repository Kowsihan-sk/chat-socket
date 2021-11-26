import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
import Image from './Image';

const Chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const [file, setFile] = useState();

    const selectFile = (e) => {
        setCurrentMessage(e.target.files[0].name);
        setFile(e.target.files[0]);
    }

    const sendMessage = async () => {
        if (file) {
            const messageData = {
                room: room,
                author: username,
                body: file,
                type: "file",
                mimetype: file.type,
                fileName: file.name,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            setCurrentMessage("");
            setFile();
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            return;
        }
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                body: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };

            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        })
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Room ID : {room}</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((content) => {
                        if (content.type === "file") {
                            const blob = new Blob([content.body], { type: content.type });
                            return (<div className="message" id={username === content.author ? "you" : "other"}>
                                <div className="message-content">
                                    <Image fileName={content.fileName} blob={blob} />
                                </div>
                                {/* <div className="message-meta">
                                    <p id="time">{content.time}</p>
                                    <p id="author">{content.author}</p>
                                </div> */}
                            </div>
                            )
                        } else {

                            return (<div className="message" id={username === content.author ? "you" : "other"}>
                                <div>
                                    <div className="message-content">
                                        <p>{content.body}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{content.time}</p>
                                        <p id="author">{content.author}</p>
                                    </div>
                                </div>
                            </div>)
                        }
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" placeholder="Hey..."
                    value={currentMessage}
                    onChange={(e) => {
                        setCurrentMessage(e.target.value);
                    }}
                    onKeyPress={(e) => { e.key === "Enter" && sendMessage() }} />
                <input type="file" onChange={selectFile} />
                <button onClick={sendMessage} >&#9658;</button>
            </div>
        </div>
    )
}

export default Chat
