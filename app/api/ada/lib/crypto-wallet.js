// @flow

import bip39 from 'bip39';
import { Blake2b, Wallet } from 'rust-cardano-crypto';
import {
  encryptWithPassword,
  decryptWithPassword
} from '../../../utils/passwordCipher';

import type {
  ConfigType,
  NetworkConfigType,
} from '../../../../config/config-types';

declare var CONFIG: ConfigType;

const protocolMagic = CONFIG.network.protocolMagic;

export const generateAdaMnemonic = () => bip39.generateMnemonic(128).split(' ');

export const isValidAdaMnemonic = (
  phrase: string,
  numberOfWords: number = 12
) =>
  phrase.split(' ').length === numberOfWords && bip39.validateMnemonic(phrase);

export function generateWalletSeed(secretWords: string, password: ?string): WalletSeed {
  const entropy = bip39.mnemonicToEntropy(secretWords);
  const seed: Uint8Array = Blake2b.blake2b_256(entropy);
  return {
    seed: password ? undefined : seed,
    encryptedSeed: password ? encryptWithPassword(password, seed) : undefined
  };
}

export function getCryptoWalletFromSeed(
  walletSeed: WalletSeed,
  password: ?string
): CryptoWallet {
  let seed;
  if (password && walletSeed.encryptedSeed) {
    seed = decryptWithPassword(password, walletSeed.encryptedSeed);
  } else {
    seed = walletSeed.seed;
  }
  const seedAsArray = Object.values(seed);
  const wallet = Wallet.fromSeed(seedAsArray).result;
  wallet.config.protocol_magic = protocolMagic;
  return wallet;
}
