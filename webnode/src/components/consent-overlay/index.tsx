import React from "react";

import ButtonGroup from "./button-group";
import MiddleGroup from "./middle-group";
import LogoGroup from "./logo-group";
import WebFont from "webfontloader";
import styled from "styled-components";
import { Container, Flexbox } from "../generic";

WebFont.load({
  google: {
    families: ["Poppins:400,600", "sans-serif"]
  }
});

const OuterContainer = styled(Container)`
  @media (max-width: 1200px) {
    height: 200px;
  }
`;

const BlueBar = styled(Container)`
`;

const InnerContainer = styled(Flexbox)`
  @media (max-width: 1200px) {
    flex-direction: column;
    height: 200px;
  }
`;

interface ConsentOverlayProps {
  giveConsent: () => any;
  denyConsent: () => any;
  status: string;
}

class ConsentOverlay extends React.Component<ConsentOverlayProps> {
  render() {
    const { denyConsent, giveConsent } = this.props;
    return (
      <OuterContainer 
        alignItems="center" 
        height="300px"
        fontFamily="Poppins"
        overflow="hidden"
        bottom="0"
        left="0"
        right="0"
        position="fixed"
        background-color="#ffffff"
      >
        <BlueBar top="0"
          height="6px"
          width="100%"
          borderBottom="solid 6px #088ffc" 
        />
        <InnerContainer
          alignItems="center"
          height="300px"
          flexDirection="row"
          justifyContent="space-around"
        >
          <LogoGroup />
          <MiddleGroup />
          <ButtonGroup giveConsent={giveConsent} denyConsent={denyConsent} />
        </InnerContainer >
      </OuterContainer>
    );
  }
}

export default ConsentOverlay;
