import {withdrawL2} from "./l2";
import {l1Contract, l1Provider, l2Provider, l1Signer, L2_NFT_ABI, l2Contract, L2_NFT_ADDRESS} from "../config";
import {Contract, BigNumber, ethers} from "ethers";
import {utils} from 'zksync-web3';

async function withdrawL1(tokenId: number) {
    const proof = await withdrawL2(tokenId)
    const zkSyncAddress = await l2Provider.getMainContractAddress();
    if (!proof) {
        console.log('withdraw on L2 failed')
        return
    }
    console.log('withdraw token on L1')
    await l1Contract.withdraw(zkSyncAddress, proof?.blockNumber, proof?.id, proof?.msg, proof?.proof)
}

async function depositL1(tokenId: number) {
    const zkSyncAddress = await l2Provider.getMainContractAddress();
    // Getting the `Contract` object of the zkSync bridge
    const zkSyncContract = new Contract(
        zkSyncAddress,
        utils.ZKSYNC_MAIN_ABI,
        l1Signer
    );

    // Encoding the tx data the same way it is done on Ethereum.
    const l2NFTInterface = new ethers.utils.Interface(L2_NFT_ABI);
    const data = l2NFTInterface.encodeFunctionData("deposit", [l1Signer.address, tokenId]);

    // The price of the L1 transaction requests depends on the gas price used in the call
    const gasPrice = await l1Provider.getGasPrice();
    console.log('gas price: ', gasPrice)

    // Here we define the constant for ergs limit .
    const ergsLimit = BigNumber.from(1000);

    console.log('Getting the base cost of the execution')
    const baseCost = await zkSyncContract.l2TransactionBaseCost(
        gasPrice,
        ergsLimit,
        ethers.utils.hexlify(data).length,
        0,
    );

    console.log('Calling the L1 NFT contract with base cost:' + baseCost)
    const tx = await l1Contract.deposit(
        zkSyncAddress,
        tokenId,
        {
            // Passing the necessary ETH `value` to cover the fee for the operation
            value: baseCost,
            gasPrice
        }
    );

    console.log('Waiting until the L1 tx is complete')
    await tx.wait();

    console.log('Getting the TransactionResponse object for the L2 transaction corresponding to the execution call')
    const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

    console.log('The receipt of the L2 transaction corresponding to the call to the deposit method')
    const l2Receipt = await l2Response.wait();
    console.log(l2Receipt);
}

async function setL2Address() {
    console.log('set l2 address for l1 contract')
    await l1Contract.setL2Address(L2_NFT_ADDRESS)
}

export {
    withdrawL1,
    depositL1,
    setL2Address
}
