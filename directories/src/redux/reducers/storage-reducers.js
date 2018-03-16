import {
  STORAGE_BROKERNODE_ADD,
  STORAGE_WEBNODE_ADD,
  STORAGE_GENESISHASH_ADD,
  STORAGE_EXCHANGES_ADD,
  STORAGE_PEERID_CHANGE
} from "../actions/action-types";
import { DEFAULT_CONSTANT } from "config";

const initState = {
  peerId: DEFAULT_CONSTANT.PEER_ID,
  brokerNode: DEFAULT_CONSTANT.BROKER_NODE,
  webNode: DEFAULT_CONSTANT.WEB_NODE,
  genesisHash: DEFAULT_CONSTANT.GENESIS_HASH,
  exchanges: [
    {
      transactionId: DEFAULT_CONSTANT.EXCHANGES_TRANSACTION_ID,
      needRequested: DEFAULT_CONSTANT.EXCHANGES_NEED_REQUESTED
    }
  ]
};

export default (state = initState, action) => {
  switch (action.type) {
    case STORAGE_BROKERNODE_ADD:
      return {
        ...state,
        brokerNode: [...state.brokerNode, action.payload]
      };

    case STORAGE_WEBNODE_ADD:
      return {
        ...state,
        webNode: [...state.webNode, action.payload]
      };

    case STORAGE_GENESISHASH_ADD:
      return {
        ...state,
        genesisHash: [...state.genesisHash, action.payload]
      };

    case STORAGE_EXCHANGES_ADD:
      return {
        ...state,
        exchanges: [
          ...state.exchanges,
          {
            transactionId: action.payload.transactionId,
            need_requested: action.payload.needRequested
          }
        ]
      };

    case STORAGE_PEERID_CHANGE:
      return {
        ...state,
        peerId: action.payload
      };

    default:
      return state;
  }
};
