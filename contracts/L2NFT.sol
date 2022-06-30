// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract L2NFT is ERC721PresetMinterPauserAutoId {
    address public l1Address;

    constructor(address _l1Address) ERC721PresetMinterPauserAutoId("ZkSync L2 Token", "Z2T", "https://zk-token.com/token/") {
        l1Address = _l1Address;
    }

    function withdraw(uint256 tokenId) external returns (bytes32 messageHash) {
        require(ownerOf(tokenId) == _msgSender(), "L2NFT: only token owner can withdraw");
        bytes memory message = abi.encode(_msgSender(), tokenId);
        messageHash = L1_MESSENGER_CONTRACT.sendToL1(message);
        burn(tokenId);
    }

    function deposit(address owner, uint256 tokenId) external {
        require(_msgSender() == l1Address, "L2NFT: only l1 contract can deposit");
        _mint(owner, tokenId);
    }
}
