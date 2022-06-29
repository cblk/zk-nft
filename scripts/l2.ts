import {ethers} from "ethers";
import {l2Contract, L2_USDC_ADDRESS, l2Provider, l2Signer, L2_NFT_ADDRESS} from "../config";

export interface Proof {
    proof: string[]
    id: number
    blockNumber: number
    msg: string
}

async function mint(address: string) {
    console.log("mint token for address " + address)
    await l2Contract.mint(address, {
        customData: {
            feeToken: L2_USDC_ADDRESS,
        },
    })
}

async function withdrawL2(tokenId: number): Promise<Proof | null> {
    console.log(`withdraw token ${tokenId} on L2`)
    let tx;
    try {
        tx = await l2Contract.withdraw(tokenId, {
            customData: {
                feeToken: L2_USDC_ADDRESS,
            },
        })
    } catch (e: any) {
        console.log(e.error.error.data.message)
        return null
    }

    console.log('waiting for finality')
    const receipt = await tx.waitFinalize();
    const msg = ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [l2Signer.address, tokenId])
    console.log('finality confirmation, getting message proof from L2')
    const proof = await l2Provider.getMessageProof(
        receipt.blockNumber,
        L2_NFT_ADDRESS,
        ethers.utils.keccak256(msg)
    )
    if (!proof) {
        return null
    }
    return {proof: proof.proof, id: proof.id, blockNumber: receipt.blockNumber, msg}
}

export {
    mint,
    withdrawL2,
}







