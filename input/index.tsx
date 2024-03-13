import React from "react";
import styled from "styled-components";
import { Color } from "./Color";

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

// A styled component with external variables
const SemanticRedSpan = styled.span`
  color: ${Color.SemanticRed600};
  background-color: ${Color.SemanticGreen600};
`;

// A new component based on Button, but with some override styles
const TomatoButton = styled(ComplexButton)`
  color: tomato;
  border-color: tomato;
`;

// A table body with child td selector
export const Tbody = styled.tbody`
  color: #666;
  & > td {
    text-align: left;
    padding: 20px;
    vertical-align: top;
    border-top: 0;
  }
`;

// A section body with child selector
export const SectionMargin = styled.section`
  background-color: #666;
  & * {
    margin-bottom: 4px;
  }
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
      <SemanticRedSpan>Red</SemanticRedSpan>
    </StyledDiv>
  );
};

export default MyComponent;
