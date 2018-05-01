import {
  TREASURE_HUNT_PERFORM_POW,
  TREASURE_HUNT_FIND_TREASURE,
  TREASURE_HUNT_SAVE_TREASURE
} from "../actions/treasure-hunt-actions";

import { CHUNKS_PER_SECTOR } from "../../config/";

const initState = {
  address: null,
  genesisHash: null,
  message: null,
  chunkIdx: 0,
  numberOfChunks: 1,
  sectorIndex: 0,
  treasure: null
};

export default (state = initState, action) => {
  switch (action.type) {
    case TREASURE_HUNT_PERFORM_POW:
      const {
        address,
        message,
        genesisHash,
        sectorIndex,
        numberOfChunks
      } = action.payload;
      if (
        genesisHash === state.genesisHash &&
        sectorIndex === state.sectorIndex
      ) {
        // start from where webnode left off if it's the same
        // genesis hash and same sector index
        return {
          ...state
        };
      } else {
        const sectorStartingIdx = sectorIndex * CHUNKS_PER_SECTOR;
        return {
          ...state,
          address,
          message,
          genesisHash,
          sectorIndex,
          numberOfChunks,
          treasure: null,
          chunkIdx: sectorStartingIdx
        };
      }

    case TREASURE_HUNT_SAVE_TREASURE:
      const { treasure, nextChunkIdx } = action.payload;
      return {
        ...state,
        treasure,
        chunkIdx: nextChunkIdx
      };

    default:
      return { ...state };
  }
};