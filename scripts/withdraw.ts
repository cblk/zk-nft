import {withdrawL2} from "./l2";
import {l1Contract, l2Provider} from "../config";

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

const tokenId = 0

withdrawL1(tokenId).then()
