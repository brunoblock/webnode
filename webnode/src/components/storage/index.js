import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button, Container, Header, Image } from "semantic-ui-react";
import { CONSENT_STATUS } from "../../config";
import toArray from "lodash/toArray";

import treasureHuntActions from "../../redux/actions/treasure-hunt-actions";
import nodeActions from "../../redux/actions/node-actions";
import consentActions from "../../redux/actions/consent-actions";

import Datamap from "datamap-generator";

import { TEST_ETH_ADDRESS } from "../../config";

import TreasureTable from "./toolbox/TreasureTable";
import ConsentOverlay from "../consent-overlay";

import LOGO from "../../assets/images/logo.svg";

const GenesisHashInput = onChange => (
  <Input
    style={{ width: 1000, paddingBottom: 20 }}
    onChange={onChange}
    label={{ tag: true, content: "Genesis Hash" }}
    labelPosition="right"
    placeholder=""
  />
);

const NumberofChunksInput = onChange => (
  <Input
    onChange={onChange}
    style={{ paddingRight: 50, paddingBottom: 50 }}
    label={{ tag: true, content: "Number of Chunks" }}
    labelPosition="right"
    placeholder=""
  />
);

class Storage extends Component {
  constructor(props) {
    super(props);
    this.state = { genesisHash: "", numberOfChunks: 0 };
  }

  onGenesisHashChange = (e, data) => {
    this.setState({ genesisHash: data.value });
  };

  onNumberOfChunksChange = (e, data) => {
    this.setState({ numberOfChunks: parseInt(data.value, 10) });
  };

  renderProgress(current, max) {
    if (current > -1) {
      return (
        <div>
          {current}/{max}
        </div>
      );
    } else {
      return null;
    }
  }

  async onClick() {
    const { findTreasure } = this.props;
    const generatedMap = Datamap.rawGenerate(
      this.state.genesisHash,
      this.state.numberOfChunks
    );

    const transformedMap = toArray(generatedMap)
      .map((value, index) => ({
        dataMapHash: value,
        chunkIdx: index
      }))
      .map(obj => findTreasure(obj));

    Promise.all(transformedMap); //TODO better implementation
  }

  componentDidMount() {
    const { setOwnerEthAddress } = this.props;
    setOwnerEthAddress(TEST_ETH_ADDRESS);
  }

  startApp() {
    const { initialize } = this.props;
    initialize();
  }

  render() {
    const {
      treasures,
      numberOfCalls,
      giveConsent,
      denyConsent,
      status
    } = this.props;
    return (
      <Container style={{ backgroundColor: "#0267ea" }}>
        <div style={{ padding: 50 }}>
          <Header as="h1" style={{ color: "#ffffff" }}>
            <Image src={LOGO} /> Oyster Toolbox{" "}
            {this.renderProgress(numberOfCalls, this.state.numberOfChunks)}
          </Header>{" "}
          <div style={{ paddingTop: 50 }}>
            {" "}
            {GenesisHashInput(this.onGenesisHashChange)}
            {NumberofChunksInput(this.onNumberOfChunksChange)}
            <Button onClick={() => this.onClick()}>Look for treasures</Button>
            <Button onClick={() => this.startApp()}>Start App</Button>
          </div>
          {treasures.length !== 0 ? TreasureTable(treasures) : null}
        </div>
        {status === CONSENT_STATUS.PENDING ? (
          <ConsentOverlay giveConsent={giveConsent} denyConsent={denyConsent} />
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  statuses: state.pow.statuses,
  status: state.consent.status,
  treasures: state.test.treasures,
  numberOfCalls: state.test.numberOfCalls, //TODO remove for production
  consent: state.pow.consent
});

const mapDispatchToProps = dispatch => ({
  findTreasure: obj => dispatch(treasureHuntActions.findTreasure(obj)),
  startSector: obj => dispatch(treasureHuntActions.startSector(obj)),
  initialize: () => dispatch(nodeActions.initialize()),
  giveConsent: () => dispatch(consentActions.giveConsent()),
  denyConsent: () => dispatch(consentActions.denyConsent()),
  setOwnerEthAddress: ethAddress =>
    dispatch(nodeActions.setOwnerEthAddress(ethAddress))
});

export default connect(mapStateToProps, mapDispatchToProps)(Storage);
