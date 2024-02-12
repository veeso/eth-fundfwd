import { Alchemy, BigNumber, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { debug, info } from './log';

const NONCES = new Map<string, number>();

export const forwardEth = async (
  provider: Alchemy,
  address: string,
  privKey: string,
  outputAddress: string,
): Promise<Transaction | null> => {
  const balance = await provider.core.getBalance(address);
  if (balance.isZero()) {
    return null;
  }

  debug('got balance', balance.toString(), 'wei');

  const ethersProvider = await provider.config.getProvider();
  const wallet = new ethers.Wallet(privKey, ethersProvider);
  const nonce = await provider.core.getTransactionCount(
    wallet.address,
    'latest',
  );
  const gasPrice = await provider.core.getGasPrice();

  // check whether nonce is already used
  if (NONCES.has(address)) {
    const lastNonce = NONCES.get(address);
    if (nonce <= lastNonce) {
      info('nonce', nonce, 'is not greater than last nonce', lastNonce);
      return null;
    }
  }

  const tx = {
    to: outputAddress,
    value: balance,
    gasLimit: '21000',
    maxPriorityFeePerGas: Utils.parseUnits('1', 'gwei'),
    maxFeePerGas: gasPrice,
    nonce,
    type: 2,
    chainId: 1,
  };

  const gasFee = (await provider.transact.estimateGas(tx)).mul(gasPrice);
  debug('fee is', gasFee.toString(), 'value is', tx.value.toString());
  if (gasFee.gt(balance)) {
    info(
      'not sending funds, since fee is',
      gasFee.toString(),
      'and balance is',
      balance.toString(),
    );
    return null;
  }

  tx.value = balance.sub(gasFee);

  debug('sending transaction', tx);
  const rawTransaction = await wallet.signTransaction(tx);
  const transactionResponse =
    await provider.transact.sendTransaction(rawTransaction);
  debug(
    'got transaction result',
    transactionResponse.hash,
    'with nonce',
    transactionResponse.nonce,
  );

  NONCES.set(address, nonce);

  return {
    hash: transactionResponse.hash,
    value: balance,
  };
};

export interface Transaction {
  hash: string;
  value: BigNumber;
}
