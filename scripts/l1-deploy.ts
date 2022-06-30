// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import {L2_NFT_ADDRESS} from "../config";

async function main() {
    // We get the contract to deploy
    const L1NFT = await ethers.getContractFactory("L1NFT");

    const contract = await L1NFT.deploy();
    await contract.deployed();

    console.log(`L1NFT was deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
