import React from 'react'
import styled from 'styled-components'
import ChatComponent from './ChatBot';

export default function Welcome({currentUser}) {
  
  return (
 <ChatComponent></ChatComponent>
      

       
  
  )
}

const Container = styled.div
`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: rgb(0, 9, 28);
img{
    height: 20rem;
}
span{
    color: #4e00ff;
    text-transform: capitalize;
}
`;