import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { peerInit } from "../../redux/api/";

import StorageBootstrap from "components/storage/storage-bootstrap";

import {
  requestPeerReceive,
  requestPeerSend
} from "../../redux/actions/peer-actions";

import {
  requestPrepareTranfers,
  requestAttachToTangle,
  fullfillAttachToTangle
} from "../../redux/actions/iota-actions";

import {
  initWork,
  givePeerId,
  startTransaction,
  selectItem,
  confirmWork,
  broadcastToHooks
} from "../../redux/actions/api-actions";

import {
  storageBrokerNodeAdd,
  storageWebNodeAdd,
  storageGenesisHashAdd,
  storageExchangesAdd,
  storagePeerIdChange
} from "../../redux/actions/storage-actions";

import { requestBroadcastToHooks } from '../../redux/services';

class Storage extends Component {
  static propTypes = {
    requestPeerReceive: PropTypes.func.isRequired,
    requestPeerSend: PropTypes.func.isRequired,
    requestPrepareTranfers: PropTypes.func.isRequired
  };

  state = {
    peer: null
  };

  componentWillMount() {
    const peer = peerInit();
    const {
      storage,
      iota,
      api,
      givePeerId,
      startTransaction,
      selectItem,
      confirmWork,
      requestPrepareTranfers,
      requestAttachToTangle,
      broadcastToHooks,
      fullfillAttachToTangle

    } = this.props;
    this.setState({ peer });
    givePeerId({ peerid: peer.id });
    startTransaction({ need_requested: "hi!Api" });
    selectItem({ txid: "hi!Api", itemIndex: "hash" });
    confirmWork({ txid: "hi!Api", selectItem: "hash" });

    //REMOVE ALL THIS DUMMY DATA AND USE DATA FROM BROKER
    const dataPrepareTransfers = {
      seed:
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      address:
        "OYSTERWEBNODEWORKSOYSTERWEBNODEWORKSOYSTERWEBNODEWORKSOYSTERWEBNODEWORKSOYSTERWEB",
      value: 0,
      message: "SOMECOOLMESSAGE",
      tag: "OYSTERWEBNODEWORKING"
    };

    requestPrepareTranfers(dataPrepareTransfers);

    //REMOVE ALL THIS AND USE MWM, TRUNK, AND BRANCH FROM BROKER
    const trytes = iota.iotaPrepareTransfers;
    
    requestAttachToTangle({
      trunkTransaction:
        "9KCCKUWJUCCXGAEQTHKYUFDU9OOMEAVKCJZBBVUTVPOMJNVGHBC9UJOJTAOARFKWGI9EPMCJKFVX99999",
      branchTransaction:
        "9ETBMNMZUXKXNGEGGHLLMQSIK9TBZEDVQUAIARPDFDWQWJFNECPHPVUIFAPWJQ9MDOCUFICJCDXSA9999",
      mwm: 14,
      trytes: trytes,
        callback: (error, result) => {
          fullfillAttachToTangle({trytes: result});
        }
    });

    let hardcodedHooks = ['54.208.39.116'];
    console.log('iota war', iota.iotaAttachToTangle.trytes);
    requestBroadcastToHooks({trytes: iota.iotaAttachToTangle.trytes}, hardcodedHooks);
  }

  componentDidMount() {
    const { initWork } = this.props;
    initWork();
  }

  sendMessage = (message, receiver) => {
    const { peer } = this.state;
    this.props.requestPeerSend(peer, receiver, message);
  };

  render() {
    const { peer } = this.state;
    console.log(peer);
    const {
      storage,
      storageBrokerNodeAdd,
      storageWebNodeAdd,
      storageGenesisHashAdd,
      storageExchangesAdd,
      storagePeerIdChange
    } = this.props;

    console.log(this.props);

    return (
      <StorageBootstrap
        storage={storage}
        storageBrokerNodeAddFn={storageBrokerNodeAdd}
        storageWebNodeAddFn={storageWebNodeAdd}
        storageGenesisHashAddFn={storageGenesisHashAdd}
        storageExchangesAddFn={storageExchangesAdd}
        storagePeerIdChangeFn={storagePeerIdChange}
        onSendMessage={(message, receiver) =>
          this.sendMessage(message, receiver)
        }
        peer={peer}
      />
    );
  }
}

const mapStateToProps = state => ({
  storage: state.storage,
  api: state.api,
  iota: state.iota
});

export default connect(mapStateToProps, {
  requestPeerReceive,
  requestPeerSend,
  storageBrokerNodeAdd,
  storageWebNodeAdd,
  storageGenesisHashAdd,
  storageExchangesAdd,
  storagePeerIdChange,
  initWork,
  givePeerId,
  broadcastToHooks,
  startTransaction,
  selectItem,
  confirmWork,
  requestPrepareTranfers,
  requestAttachToTangle,
  fullfillAttachToTangle
})(Storage);
