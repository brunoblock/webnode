import _ from "lodash";

import {
  NODE_ADD_BROKER_NODE,
  NODE_ADD_GENESIS_HASH,
  NODE_RESET
} from "../actions/node-actions";

const initState = {
  brokerNodes: [],
  genesisHashes: [],
  oldGenesisHashes: [],
  id: null,
  lastResetAt: new Date()
};

const brokerNodeGenerator = address => {
  return { address };
};

const genesisHashGenerator = (genesisHash, numberOfChunks) => {
  return { genesisHash, numberOfChunks };
};

export default (state = initState, action) => {
  switch (action.type) {
    case NODE_ADD_BROKER_NODE:
      const { address } = action.payload;
      return {
        ...state,
        brokerNodes: [...state.brokerNodes, brokerNodeGenerator(address)]
      };

    case NODE_ADD_GENESIS_HASH:
      const { genesisHash, numberOfChunks } = action.payload;
      return {
        ...state,
        genesisHashes: [
          ...state.genesisHashes,
          genesisHashGenerator(genesisHash, numberOfChunks)
        ]
      };

     case NODE_ADD_OLD_GENESIS_HASH:
      const { genesisHash, numberOfChunks } = action.payload;
      return {
        ...state,
        oldGenesisHashes: [
          ...state.oldGenesisHashes,
          genesisHashGenerator(genesisHash, numberOfChunks)
        ]
      };

    case NODE_RESET:
      const { id, lastResetAt } = action.payload;
      return { ...state, id, lastResetAt, brokerNodes: [], genesisHashes: [] };

    default:
      return { ...state };
  }
};
