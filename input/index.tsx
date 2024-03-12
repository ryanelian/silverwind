import React from 'react';
import styled from 'styled-components';

// Styled component for the div
const StyledDiv = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
`;

// Styled component for the button
const StyledButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Component using the styled components
const MyComponent = () => {
  return (
    <StyledDiv>
      <h2>Styled Component with Button</h2>
      <p>This is a styled div containing a styled button.</p>
      <StyledButton>Click Me</StyledButton>
    </StyledDiv>
  );
};

export default MyComponent;
