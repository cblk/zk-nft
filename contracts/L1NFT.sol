// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
// Importing zkSync contract interface
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";
// Importing `Operations` contract which has the `QueueType` type
import "@matterlabs/zksync-contracts/l1/contracts/zksync/Operations.sol";

contract L1NFT is ERC721PresetMinterPauserAutoId {
    address private _l2Address;
    mapping(uint32 => mapping(uint256 => bool)) isWithdrew;

    constructor(address l2Address) ERC721PresetMinterPauserAutoId("ZkSync L1 Token", "Z1T", "https://zk-token.com/token/") {
        _l2Address = l2Address;
    }

    function setL2Address(address l2) public {
        require(hasRole(ERC721PresetMinterPauserAutoId.MINTER_ROLE, _msgSender()),
            "L1NFT: must have minter role to set l2 address");
        _l2Address = l2;
    }

    function deposit(address _zkSyncAddress, uint256 tokenId) external payable returns (bytes32 txHash) {
        require(_l2Address != address(0), "L1NFT: l2 address must be set");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "L1NFT: caller is not owner nor approved");

        IZkSync zksync = IZkSync(_zkSyncAddress);
        txHash = zksync.requestL2Transaction{value : msg.value}(
        // The address of the L2 contract to call
            _l2Address,
        // Encoding the calldata for the execute
            abi.encodeWithSignature("_mint(address, uint256)", ownerOf(tokenId), tokenId),
        // Ergs limit
            1000,
        // factory dependencies
            new bytes[](0),
        // The queue type
            QueueType.Deque
        );

        burn(tokenId);
    }

    function withdraw(
    // The address of the zkSync smart contract.
    // It is not recommended to hardcode it during the alpha testnet as regenesis may happen.
        address _zkSyncAddress,
    // zkSync block number in which the message was sent
        uint32 _l2BlockNumber,
    // Message index, that can be received via API
        uint256 _index,
    // The message that was sent from l2
        bytes calldata _message,
    // Merkle proof for the message
        bytes32[] calldata _proof) public {
        // check that the message has not been processed yet
        require(!isWithdrew[_l2BlockNumber][_index]);

        IZkSync zksync = IZkSync(_zkSyncAddress);
        L2Message memory message = L2Message({
        sender : _l2Address,
        data : _message
        });

        bool success = zksync.proveL2MessageInclusion(_l2BlockNumber, _index, message, _proof);
        require(success, "Failed to prove withdraw message inclusion");

        (address owner, uint256 tokenId) = abi.decode(_message, (address, uint256));
        _mint(owner, tokenId);

        // Mark message as processed
        isWithdrew[_l2BlockNumber][_index] = true;

    }
}
