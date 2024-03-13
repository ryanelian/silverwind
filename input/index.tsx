import React from "react";
import styled from "styled-components";

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

// A styled component that receives props to change its style
const ComplexButton = styled.button<{ $primary?: boolean; }>`
  /* Adapt the colors based on primary prop */
  background: ${props => props.$primary ? "#BF4F74" : "white"};
  color: ${props => props.$primary ? "white" : "#BF4F74"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`;

// A new component based on Button, but with some override styles
const TomatoButton = styled(ComplexButton)`
  color: tomato;
  border-color: tomato;
`;

// Component using the styled components
const MyComponent = () => {
  return (
    <StyledDiv>
      <h2>Styled Component with Button</h2>
      <p>This is a styled div containing a styled button.</p>
      <StyledButton>Click Me</StyledButton>
      <ComplexButton $primary>Test</ComplexButton>
      <TomatoButton>I'm a Tomato</TomatoButton>
    </StyledDiv>
  );
};

export default MyComponent;
