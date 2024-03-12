import React from 'react';
import styled from 'styled-components';

// Styled component for the div
const StyledDiv = function ({
  children
}: React.PropsWithChildren) {
  return <div className="bg-[#f0f0f0] p-[20px]">{children}</div>;
};

// Styled component for the button
const StyledButton = function ({
  children
}: React.PropsWithChildren) {
  return <button className="bg-[#007bff] text-white cursor-pointer text-[16px] transition-[background-color] duration-[0.3s] ease-[ease] px-[20px] py-[10px] rounded-[5px] border-[none] hover:bg-[#0056b3]">{children}</button>;
};

// Component using the styled components
const MyComponent = () => {
  return <StyledDiv>
      <h2>Styled Component with Button</h2>
      <p>This is a styled div containing a styled button.</p>
      <StyledButton>Click Me</StyledButton>
    </StyledDiv>;
};
export default MyComponent;