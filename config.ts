import {Contract, ethers, Wallet} from "ethers";
import {Contract as zkContract, Provider, Wallet as zkWallet} from "zksync-web3";

const PRIVATE_KEY = ''
const INFURA_KEY = ''

const L1_NFT_ADDRESS = "0xc9DF260231829eF06A7aD64feA08AB1EA6c3533c";
const L2_NFT_ADDRESS = "0x803C3c69437915965eEDC97d1B39351Adcc9a52D";
const L2_USDC_ADDRESS = "0x54a14D7559BAF2C8e8Fa504E019d32479739018c";

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

