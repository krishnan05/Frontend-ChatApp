import React, { useState, useRef } from 'react';
import { chatbotapi } from '../utils/APIRoutes';
import axios from "axios";
import ChatInput from './ChatInput';
import styled from "styled-components"
import { v4 as uuidv4} from "uuid"

const ChatComponent = () => {
    const scrollRef = useRef();
  
  const [botResponse, setBotResponse] = useState();
  const [messages, setMessages] = useState([
    { text: 'Hello, how can I help you?', fromself:false},
  ]);

  const sendMessage = async (msg) => {

 
    const UserMessage={
        text:msg,
        fromSelf:true
    }
 
    setMessages((prevMessages) => [...prevMessages, UserMessage]);
   
    try {
    const response = await axios.post(chatbotapi, { message:msg });
      
    const Botresponse = {
        text:response.data.reply[0].generated_text,
        fromSelf:false
    };
    // setMessages(prevMessages => [...prevMessages, botResponse]);
    setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, Botresponse]);
      }, 1000);
    
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
    <>
      {
        (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                
                <div className="username">
                  <h3>ChatBot</h3>
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
                        <p>{message.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
            <ChatInput handleSendMsg={sendMessage} />
           

          </Container>
        )
      }
    </>
  );
}
export default ChatComponent;
// return (
//     <div>
//       <div>Bot : {botResponse}</div>
//       <input
//         type="text"
//         value={userMessage}
//         onChange={(e) => setUserMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };
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
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #00000039;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #00000039;
      }
    }
  }
`;
