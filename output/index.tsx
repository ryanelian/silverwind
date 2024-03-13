import React from "react";
import styled from "styled-components";

// Styled component for the div
const StyledDiv = React.forwardRef((props: React.ComponentPropsWithoutRef<"div">, ref: React.ComponentProps<"div">["ref"]) => {
  return <div className="bg-[#f0f0f0] p-[20px]" ref={ref} {...props}></div>;
});

// Styled component for the button
const StyledButton = React.forwardRef((props: React.ComponentPropsWithoutRef<"button">, ref: React.ComponentProps<"button">["ref"]) => {
  return <button className="bg-[#007bff] text-white cursor-pointer text-[16px] transition-[background-color] duration-[0.3s] ease-[ease] px-[20px] py-[10px] rounded-[5px] border-[none] hover:bg-[#0056b3]" ref={ref} {...props}></button>;
});

// A styled component that receives props to change its style
const ComplexButton = styled.button<{
  $primary?: boolean;
}>`
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
  return <StyledDiv>
      <h2>Styled Component with Button</h2>
      <p>This is a styled div containing a styled button.</p>
      <StyledButton>Click Me</StyledButton>
      <ComplexButton $primary>Test</ComplexButton>
      <TomatoButton>I'm a Tomato</TomatoButton>
    </StyledDiv>;
};
export default MyComponent;