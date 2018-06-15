import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { combineEpics } from "redux-observable"; //TODO remove store as dependency

import find from "lodash/find";

import nodeActions from "../actions/node-actions";
import treasureHuntActions from "../actions/treasure-hunt-actions";
import iota from "../services/iota";
import BrokerNode from "../services/broker-node";
import util from "node-forge/lib/util";

import Datamap from "datamap-generator";

import { CHUNKS_PER_SECTOR } from "../../config/";

const performPowEpic = (action$, store) => {
  return action$
    .ofType(treasureHuntActions.TREASURE_HUNT_PERFORM_POW)
    .mergeMap(action => {
      const { treasureHunt } = store.getState();
      const { dataMapHash, treasure, chunkIdx } = treasureHunt;

      const hashInBytes = util.hexToBytes(dataMapHash);
      const [obfuscatedHash, nextDataMapHash] = Datamap.hashChain(hashInBytes);
      const address = iota.toAddress(iota.utils.toTrytes(obfuscatedHash));

      // TODO: change this
      const value = 0;
      const tag = "EDMUNDANDREBELWUZHERE";
      const seed =
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

      return fromPromise(iota.findMostRecentTransaction(address))
        .map(transaction => transaction.signatureMessageFragment)
        .mergeMap(message =>
          fromPromise(iota.getTransactionsToApprove(1)).map(
            ({ trunkTransaction: trunkTx, branchTransaction: branchTx }) => {
              return { message, trunkTx, branchTx };
            }
          )
        )
        .mergeMap(({ trunkTx, branchTx, message }) =>
          fromPromise(
            iota.prepareTransfers({ address, message, value, tag, seed })
          ).map(trytes => {
            return { trytes, trunkTx, branchTx };
          })
        )
        .mergeMap(({ trytes, trunkTx, branchTx }) =>
          fromPromise(
            iota.localPow({
              trunkTx,
              branchTx,
              mwm: 9,
              trytes
            })
          )
        )
        .mergeMap(trytesArray =>
          fromPromise(iota.broadcastTransactions(trytesArray))
        )
        .mergeMap(() =>
          of(
            !treasure
              ? treasureHuntActions.findTreasure({
                  dataMapHash,
                  chunkIdx
                })
              : treasureHuntActions.incrementChunk({
                  nextChunkIdx: chunkIdx + 1,
                  nextDataMapHash: util.bytesToHex(nextDataMapHash)
                })
          )
        )
        .catch(error => {
          console.log("TREASURE HUNTING ERROR", error);
          return empty();
        });
    });
};

const findTreasureEpic = (action$, store) => {
  return action$
    .ofType(treasureHuntActions.TREASURE_HUNT_FIND_TREASURE)
    .mergeMap(action => {
      const { dataMapHash, chunkIdx } = action.payload;

      const hashInBytes = util.hexToBytes(dataMapHash);
      const [obfuscatedHash, nextDataMapHashInBytes] = Datamap.hashChain(
        hashInBytes
      );
      const nextDataMapHash = util.bytesToHex(nextDataMapHashInBytes);
      const address = iota.toAddress(iota.utils.toTrytes(obfuscatedHash));

      return fromPromise(
        iota.findMostRecentTransaction(address)
      ).mergeMap(transaction => {
        const sideChain = Datamap.sideChainGenerate(dataMapHash);

        store.dispatch({
          //TODO Remove this dispatch
          type: "IOTA_RETURN"
        });

        const chainWithTreasure = find(sideChain, hashedAddress => {
          return !!Datamap.decryptTreasure(
            hashedAddress,
            transaction.signatureMessageFragment,
            dataMapHash
          );
        });

        return of(
          !!chainWithTreasure
            ? treasureHuntActions.saveTreasure({
                treasure: Datamap.decryptTreasure(
                  chainWithTreasure,
                  transaction.signatureMessageFragment,
                  dataMapHash
                ),
                nextChunkIdx: chunkIdx + 1,
                nextDataMapHash
              })
            : treasureHuntActions.incrementChunk({
                nextChunkIdx: chunkIdx + 1,
                nextDataMapHash
              })
        );
      });
    });
};

const nextChunkEpic = (action$, store) => {
  return action$
    .ofType(
      treasureHuntActions.TREASURE_HUNT_START_SECTOR,
      treasureHuntActions.TREASURE_HUNT_SAVE_TREASURE,
      treasureHuntActions.TREASURE_HUNT_INCREMENT_CHUNK
    )
    .mergeMap(() => {
      const { treasureHunt, node } = store.getState();
      const {
        treasure,
        genesisHash,
        chunkIdx,
        numberOfChunks,
        sectorIdx
      } = treasureHunt;
      const { ethAddress } = node;

      const endOfFile = chunkIdx > numberOfChunks;
      const endOfSector = chunkIdx > CHUNKS_PER_SECTOR * (sectorIdx + 1) - 1;

      return of(
        endOfFile || endOfSector
          ? treasureHuntActions.claimTreasure({
              genesisHash,
              numberOfChunks,
              receiverEthAddr: ethAddress,
              sectorIdx,
              treasure
            })
          : treasureHuntActions.performPow()
      );
    });
};

const claimTreasureEpic = (action$, store) => {
  return action$
    .ofType(treasureHuntActions.TREASURE_HUNT_CLAIM_TREASURE)
    .mergeMap(action => {
      const {
        receiverEthAddr,
        genesisHash,
        numChunks,
        sectorIdx,
        treasure
      } = action.payload;
      const ethKey = treasure;

      return fromPromise(
        BrokerNode.claimTreasure({
          receiverEthAddr,
          genesisHash,
          numChunks,
          sectorIdx,
          ethKey
        })
      )
        .map(() =>
          treasureHuntActions.claimTreasureSuccess({ genesisHash, sectorIdx })
        )
        .catch(error => {
          console.log("CLAIM TREASURE ERROR: ", error);
          return empty();
        });
    });
};

const completeSectorEpic = (action$, store) => {
  return action$
    .ofType(treasureHuntActions.TREASURE_HUNT_CLAIM_TREASURE_SUCCESS)
    .map(action => {
      const { genesisHash, sectorIdx } = action.payload;
      return nodeActions.markSectorAsClaimed({ genesisHash, sectorIdx });
    });
};

export default combineEpics(
  performPowEpic,
  findTreasureEpic,
  nextChunkEpic,
  completeSectorEpic,
  claimTreasureEpic
);
