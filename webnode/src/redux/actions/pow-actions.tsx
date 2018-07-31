export const IOTA_POW = "directories/pow/iota_pow";
export const IOTA_POW_SUCCESS = "directories/pow/iota_pow_success";
export const IOTA_COMPLETE = "directories/pow/iota_complete";

const ACTIONS = Object.freeze({
    // actions
    IOTA_POW,
    IOTA_POW_SUCCESS,
    IOTA_COMPLETE,

    // actionCreators
    requestPoW: ({
                     branchTransaction,
                     broadcastingNodes,
                     mwm,
                     trunkTransaction,
                     trytes
                 } :any) => ({
        type: IOTA_POW,
        payload: {
            branchTransaction,
            broadcastingNodes,
            mwm,
            trunkTransaction,
            trytes
        }
    }),
    requestPoWSuccess: ({arrayOfTrytes, broadcastingNodes}: any) => ({
        type: IOTA_POW_SUCCESS,
        payload: {arrayOfTrytes, broadcastingNodes}
    }),
    powComplete: () => ({
        type: IOTA_COMPLETE
    })
});

export default ACTIONS;