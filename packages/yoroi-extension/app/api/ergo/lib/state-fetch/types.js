// @flow

import type { BackendNetworkInfo } from '../../../common/lib/state-fetch/types';

export type AddressUtxoRequest = {|
  ...BackendNetworkInfo,
  addresses: Array<string>,
|};
export type RemoteUnspentOutput = {|
  +amount: string,
  +receiver: string,
  +tx_hash: string,
  +tx_index: number, // index of output in tx
  +creationHeight: number,
  +boxId: string,
  +assets?: $ReadOnlyArray<$ReadOnly<{
    amount: string,
    tokenId: string,
    ...
  }>>,
  +additionalRegisters?: {| [key: string]: string /* hex */ |},
  +ergoTree: string,
|};
export type AddressUtxoResponse = Array<RemoteUnspentOutput>;
export type AddressUtxoFunc = (body: AddressUtxoRequest) => Promise<AddressUtxoResponse>;

export type TxBodiesRequest = {|
  ...BackendNetworkInfo,
  txHashes: Array<string>,
|};
export type TxBodiesResponse = {|
  [txHash: string]: {
    summary: {
      id: string,
      timestamp: number,
      index: number,
      size: number,
      confirmationsCount: number,
      block: {
        id: string,
        height: number,
        ...,
      },
      ...,
    },
    inputs: Array<ErgoTxInput>,
    dataInputs: Array<ErgoTxDataInput>,
    outputs: Array<ErgoTxOutput>,
    ...,
  }
|};
export type TxBodiesFunc = (body: TxBodiesRequest) => Promise<TxBodiesResponse>;

export type UtxoSumRequest = {|
  ...BackendNetworkInfo,
  addresses: Array<string>,
|};
export type UtxoSumResponse = {|
  sum: string,
|};
export type UtxoSumFunc = (body: UtxoSumRequest) => Promise<UtxoSumResponse>;

export type HistoryRequest = {|
  ...BackendNetworkInfo,
  addresses: Array<string>,
  // omitting "after" means you query starting from the genesis block
  after?: {|
    block: string, // block hash
    tx: string, // tx hash
  |},
  untilBlock: string, // block hash - inclusive
|};

export type ErgoTxOutput = {
  additionalRegisters: {| [key: string]: string /* hex */ |},
  address: string,
  assets: $ReadOnlyArray<$ReadOnly<{
    amount: string,
    tokenId: string,
    ...
  }>>,
  // any height <= the height the tx was included in (used for rent calculation, etc)
  creationHeight: number,
  ergoTree: string,
  id: string, // boxId
  txId: string, // txhash of this
  index: number, // index of this output in this tx
  mainChain: boolean,
  spentTransactionId: null | string,
  value: string,
  ...
};
export type ErgoTxInput = {
  address: string,
  id: string, // boxId
  outputTransactionId: string, // txHash of tx that created the output we're consuming
  index: number, // index of this input in this tx
  outputIndex: number, // index in tx that created the output we're consuming
  spendingProof: string,
  transactionId: string, // txHash of this tx
  value: string,
  assets: $ReadOnlyArray<$ReadOnly<{
    amount: string,
    tokenId: string,
    ...
  }>>,
  ...
};
export type ErgoTxDataInput = {
  id: string,
  value: string,
  transactionId: string,
  index: number,
  outputIndex: number,
  outputTransactionId: string,
  address: string,
  ...,
};
export type RemoteErgoTransaction = {|
  block_hash: null | string,
  block_num: null | number,
  tx_ordinal: null | number,
  hash: string,
  inputs: Array<ErgoTxInput>,
  dataInputs: Array<ErgoTxDataInput>,
  outputs: Array<ErgoTxOutput>,
  // epoch: 0, // TODO
  // slot: 0, // TODO
  time: string, // ISO string
  tx_state: RemoteTxState, // explorer doesn't handle pending transactions
|};
export type HistoryResponse = Array<RemoteErgoTransaction>;
export type HistoryFunc = (body: HistoryRequest) => Promise<HistoryResponse>;

export type BestBlockRequest = {|
  ...BackendNetworkInfo,
|};
export type BestBlockResponse = {|
  epoch: 0, // TODO
  slot: 0, // TODO
  // null when no blocks in db
  hash: null | string,
  // 0 if no blocks in db
  height: number,
|};
export type BestBlockFunc = (body: BestBlockRequest) => Promise<BestBlockResponse>;

export type SignedRequest = {|
  ...BackendNetworkInfo,
  id?: string, // hex
  inputs: Array<{|
    boxId: string, // hex
    spendingProof: {|
      proofBytes: string, // hex
      extension: {| [key: string]: string /* hex */ |},
    |},
    extension?: {| [key: string]: string /* hex */ |},
  |}>,
  dataInputs: Array<{|
    boxId: string, // hex
    extension?: {| [key: string]: string /* hex */ |},
  |}>,
  outputs: Array<{|
    boxId?: string, // hex
    value: string,
    ergoTree: string, // hex
    creationHeight: number,
    assets?: $ReadOnlyArray<$ReadOnly<{|
      tokenId: string, // hex
      amount: string,
    |}>>,
    additionalRegisters: {| [key: string]: string /* hex */ |},
    transactionId?: string, // hex
    index?: number,
  |}>,
  size?: number,
|};
export type SignedResponse = {|
  txId: string, // hex
|};
export type SendFunc = (body: SignedRequest) => Promise<SignedResponse>;

/* Backend service data types */

export type RemoteTxState = 'Successful' | 'Failed' | 'Pending';

export type AssetInfoRequest = {|
  ...BackendNetworkInfo,
  assetIds: Array<string>
|};
export type AssetInfo = {|
  name: null | string,
  desc: null | string,
  numDecimals: null | number,
  boxId: string,
  height: number,
|};
export type AssetInfoResponse = {|
  [assetId: string]: AssetInfo
|};
export type AssetInfoFunc = (body: AssetInfoRequest) => Promise<AssetInfoResponse>;
