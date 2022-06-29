import { Wallet } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import {PRIVATE_KEY} from "../config";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the L2NFT contract`);

    // Initialize the wallet.
    const wallet = new Wallet(PRIVATE_KEY);

    // Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet);
    const artifact = await deployer.loadArtifact("L2NFT");

    const l2NFTContract = await deployer.deploy(artifact, []);

    // Show the contract info.
    console.log(`${artifact.contractName} was deployed to ${l2NFTContract.address}`);
}
