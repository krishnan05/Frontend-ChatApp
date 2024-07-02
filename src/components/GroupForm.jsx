// NewGroupForm.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { addNewGroup } from '../utils/APIRoutes';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"
const NewGroupForm = ({ closeForm, currentUser }) => {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState([]);

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  };
  const handleInputChange = (e) => {
    setGroupName(e.target.value);
  };
  const handleParticipantsChange = (e) => {
    const inputValues = e.target.value.split(',').map((value) => value.trim());
   
    setParticipants(inputValues);
  
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  

    try {
    
        const data = await axios.post(addNewGroup,{ name: groupName, creator:currentUser,participants:participants});
        if(data.status === false){
            toast.error(data.msg, toastOptions);
          } else {
            closeForm()
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          value={groupName}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="participants">Participants</label>
        <input
  type="text"
  id="participants"
  name="participants"
  value={participants.join(',')} 
  onChange={handleParticipantsChange}
  
  required
/>
        <SubmitButton type="submit">Create Group</SubmitButton>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
      font-size: 1.2rem;
      color: black;
    }

    input {
      padding: 0.5rem;
      font-size: 1rem;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 0.7rem;
  background-color: #4f04ff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 0.3rem;

  &:hover {
    background-color: #350384;
  }
`;

export default NewGroupForm;
