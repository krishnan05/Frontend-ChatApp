import styled from "styled-components"
import { useState, useEffect , useRef} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host, allGroupsRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import GroupChatContainer from "../components/GroupChatContainer";
import ChatComponent from "../components/ChatBot";

export default function Chats() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentGroup, setCurrentGroup] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
   const [chatType, setChatType] = useState();


  useEffect( ()=>{
    const navigationTo = async () => {
      if (!localStorage.getItem('chat-app-user'))
      {
        navigate("/login");
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        setIsLoaded(true);
      }
    }
    navigationTo();
   }, []);

   useEffect( () => {
    const getCurrentUser = async()=>{
      if( currentUser)  {
      if(currentUser){
        const data = await  axios.get(`${allUsersRoute}/${currentUser._id}`);
        const groupdata = await axios.get(`${allGroupsRoute}/${currentUser._id}`)
        setContacts(data.data);
        setGroups(groupdata.data);
      } else{
        navigate('/login');
      }
    }
    }
      getCurrentUser();
  }, [currentUser]);

   useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
   },[currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);

  }
  const handleChatType = (chatType) =>{
    setChatType(chatType);
  }
  const handleGroup = (chat) =>{
    setCurrentGroup(chat);

  }

  return (
    <Container>
      <div className="container">
        
        <Contacts contacts={contacts} groups={groups} currentUser= {currentUser} changeChat={handleChatChange} changeChatType={handleChatType} changeGroup={handleGroup} />
        
        {chatType === 'chatbot'?(
          <ChatComponent></ChatComponent>
        ):("")}
        {isLoaded &&
          (currentChat === undefined && currentGroup ===undefined? (
            <Welcome currentUser={currentUser} />
          ) : chatType === 'group' ? (
            <GroupChatContainer
              currentChat={currentGroup}
              socket={socket}
              currentUser={currentUser}
              groups={groups}
            />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              currentUser={currentUser}
            />
          ))}
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #b4d2d4;
  .container {
    height: 85vh;
    width: 85vw;
      background-color: rgba(255, 250, 250, 0.829);
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
