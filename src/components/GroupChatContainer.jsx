import React, { useState, useEffect , useRef} from 'react'
import styled from "styled-components"
import ChatInput from './ChatInput';
import axios from "axios";
import { getAllGroupMessagesRoute, sendGroupMessageRoute } from '../utils/APIRoutes'
import { v4 as uuidv4} from "uuid";

export default function GroupChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (currentChat && currentChat._id) {
        const response = await axios.post(getAllGroupMessagesRoute, {
          group: currentChat._id,
          from: currentUser._id,
        });
        const res = response.data;
        setMessages(res);
      }
    };
    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendGroupMessageRoute, {
      from: currentUser._id,
      group: currentChat._id,
      message: msg,
    });

    socket.current.emit("send-group-msg", {
      group: currentChat._id,
      from: currentUser._id,
      message: msg,
      sender: currentUser.username,
    });

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (currentChat && currentChat._id) {
    socket.current.emit("join-group", {
      userId: currentUser._id,
      groupId: currentChat._id,
    });}
  }, [currentChat._id, currentUser._id, socket]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("groupMessage", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg.message,
          sender: msg.sender,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage && currentChat) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromSelf: arrivalMessage.fromSelf,
          message: arrivalMessage.message,
          sender: arrivalMessage.sender,
        },
      ]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                
                <div className="username">
                  <h3>{currentChat.name}</h3>
                </div>
              </div>
              
            </div>
            <div className="chat-messages">
              {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div 
                      className={`message ${message.fromSelf ?
                        "sended" :
                        "recieved"
                        }`}
                    >  
                      <div className="content ">
                      <div className="username">{message.fromSelf ? "" : message.sender}</div>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Container>
        )
      }
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: rgb(0, 31, 68);
          text-transform: capitalize;
        }
      }
    }
  }
   .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #000000;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #000000;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        .username {
          font-weight: bold; 
          color: #007bff; 
        }
      
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;