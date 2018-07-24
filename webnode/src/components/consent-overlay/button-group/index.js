import React from "react";
import styled from "styled-components";

const Button = styled.button`
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: Poppins;
  font-size: 23px;
  font-weight: 600;
  height: 50px;
  margin: 15px;
  min-width: 300px;
  outline: none;
  padding: 0;
  width: 100%;
  @media (max-width: 1200px) {
    border-radius: 8px;
    font-size: 16px;
    height: 40px;
    margin: 5px;
    min-width: 180px;
  }
`;

const ContinueButton = styled(Button)`
  background: #088ffc;
  background: rgba(8, 143, 252);
  border: none;
  color: white;
  :hover: {
    background: #088ffc;
  }
`;

const DenyButton = styled(Button)`
  background: #ffffff;
  border-color: #f76868;
  border-style: solid;
  border-width: 1px;
  color: #f76868;
  :hover: {
    background: #f76868;
    border-color: #f76868;
  }
`;

const DesktopContainer = styled.div`
  list-style-type: none;
  margin-right: 0;
  min-width: 200px;
  width: 15%;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 0;
  min-width: 200px;
  width: 90%;
  @media (min-width: 1201px) {
    display: none;
  }
`;

const ButtonGroup = ({ giveConsent, denyConsent }) => (
  <div>
    <DesktopContainer>
      <li>
        {" "}
        <ContinueButton onClick={giveConsent}>Continue Ad-Free</ContinueButton>
      </li>
      <li>
        {" "}
        <DenyButton onClick={denyConsent}>Deny Consent</DenyButton>
      </li>
    </DesktopContainer>
    <MobileContainer>
      <ContinueButton onClick={giveConsent}>Continue Ad-Free</ContinueButton>
      <DenyButton onClick={denyConsent}>Deny Consent</DenyButton>
    </MobileContainer>
  </div>
);

export default ButtonGroup;