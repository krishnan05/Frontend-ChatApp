import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import NewGroupForm from './GroupForm';
import Logout from './Logout';
export default function Contacts({ contacts, groups, currentUser, changeChat, changeChatType, changeGroup }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [chatType, setChatType] = useState('personal');
  const [newGroupForm, setNewGroupForm] = useState(false);
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const switchToPersonalChat = () => {
    setChatType((prevChatType) => {
      if (prevChatType !== 'personal') {
        changeChatType('personal');
      }
      return 'personal';
    });
  };

  const switchToGroupChat = () => {
    setChatType((prevChatType) => {
      if (prevChatType !== 'group') {
        changeChatType('group');
      }
      return 'group';
    });
  };

  const changeCurrentGroup = (index, contact) => {
    setCurrentSelected(index);
    changeGroup(contact);
  };

  const addNewGroup = () => {
    const a = !newGroupForm;
    setNewGroupForm(a);
  };

  const closeNewGroupForm = () => {
    setNewGroupForm(false);
  };

  return (
    <>
      {currentUserName && (
        <Container>
          <div className="brand">
            <Logout />
            <div className="toggle-container">
              <div className="button-container">
                <button
                  className={chatType === 'personal' ? 'active' : ''}
                  onClick={switchToPersonalChat}
                >
                  Personal Chat
                </button>
                <button
                  className={chatType === 'group' ? 'active' : ''}
                  onClick={switchToGroupChat}
                >
                  Group Chat
                </button>
              </div>
            </div>
          </div>
          <div className="contacts">
            {chatType === 'personal' &&
              contacts.map((contact, index) => (
                <div
                  className={`contact ${index === currentSelected ? 'selected' : ''}`}
                  key={contact._id}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                  
                </div>
              ))
              }
              
            {chatType === 'group' &&
              groups.map((group, index) => (
                <div
                  className={`contact ${index === currentSelected ? 'selected' : ''}`}
                  key={group._id}
                  onClick={() => changeCurrentGroup(index, group)}
                >
                  <div className="username">
                    <h3>{group.name}</h3>
                  </div>
                </div>
              ))}
            <div className="toggle-container">
              <div className="button-container">
                <button className="active" onClick={addNewGroup}>
                  New Group
                </button>
              </div>
            </div>
            
          </div>
          <div className="current-user">
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
      {newGroupForm && <NewGroupForm closeForm={closeNewGroupForm} currentUser={currentUser} />}
    </>
  );
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color:  #000000;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #rgba(86, 173, 255, 0.224)
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
          text-transform: capitalize;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }
  .current-user {
    background-color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
        text-transform: capitalize;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  .toggle-container button:hover {
    background-color: #444;
  }

  .toggle-container button.active {
    background-color:#4f04ff;
  }
  .button-container {
    display: flex;
    gap: 1rem;
  }
  
  button {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    border: none;
    cursor: pointer;
  }
  
  button.active {
    background-color: #4f04ff;
    color: #ffffff;
  }
  
  button svg {
    font-size: 1.3rem;
    color: #ebe7ff;
    margin-right: 0.5rem; /* Adjust the margin according to your preference */
  }
`;

