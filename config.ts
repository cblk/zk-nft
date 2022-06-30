import {Contract, ethers, Wallet} from "ethers";
import {Contract as zkContract, Provider, Wallet as zkWallet} from "zksync-web3";

const PRIVATE_KEY = ''
const INFURA_KEY = '50bfa7c920b045b4b23ebc1a3ab4223b'

const L1_NFT_ADDRESS = '';
const L2_NFT_ADDRESS = '';
const L2_USDC_ADDRESS = '0x54a14D7559BAF2C8e8Fa504E019d32479739018c';

const L1_NFT_ABI = require("./artifacts/contracts/L1NFT.sol/L1NFT.json").abi;
const L2_NFT_ABI = require("./artifacts-zk/contracts/L2NFT.sol/L2NFT.json").abi;

const l1Provider = new ethers.providers.InfuraProvider("goerli", INFURA_KEY);

const l1Signer = (new Wallet(PRIVATE_KEY, l1Provider));
const l1Contract = new Contract(
    L1_NFT_ADDRESS,
    L1_NFT_ABI,
    l1Signer
);

const l2Provider = new Provider('https://zksync2-testnet.zksync.dev');
const l2Signer = (new zkWallet(PRIVATE_KEY, l2Provider));
const l2Contract = new zkContract(
    L2_NFT_ADDRESS,
    L2_NFT_ABI,
    l2Signer
);

export {
    PRIVATE_KEY,
    INFURA_KEY,
    L1_NFT_ABI,
    L2_NFT_ABI,
    L1_NFT_ADDRESS,
    L2_NFT_ADDRESS,
    l1Contract,
    l2Contract,
    l1Signer,
    l2Signer,
    l1Provider,
    l2Provider,
    L2_USDC_ADDRESS
}

