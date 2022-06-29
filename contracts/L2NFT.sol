// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract L2NFT is ERC721PresetMinterPauserAutoId {
    constructor() ERC721PresetMinterPauserAutoId("ZkSync L2 Token", "Z2T", "https://zk-token.com/token/") {}

    function withdraw(uint256 tokenId) external returns(bytes32 messageHash) {
        require(ownerOf(tokenId) == _msgSender(), "L2NFT: only token owner can withdraw");
        bytes memory message = abi.encode(_msgSender(), tokenId);
        messageHash = L1_MESSENGER_CONTRACT.sendToL1(message);
        burn(tokenId);
    }
}
