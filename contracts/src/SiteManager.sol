//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

import "hardhat/console.sol";

contract SiteManager {
  ENS private immutable s_ens;
  bytes32 private immutable s_manageNode;
  PublicResolver private immutable s_resolver;

  event SubdomainRegistered (address owner, bytes32 indexed label);

  constructor(ENS _registryAddr, PublicResolver _resolverAddr, bytes32 _manageNode) {
    s_ens = _registryAddr;
    s_resolver = _resolverAddr;
    s_manageNode = _manageNode;
  }

  /**
    * Create a subnode for the managed node and update the resolver with
    * with function calls from `data`. Finally, set the owner of the subnode
    * to be the `msg.sender`
    */
  function subdomainRegister (bytes32 label, bytes[] calldata data) external returns (bytes[] memory results) {
    // Create the subdomain through this contract so that the contract is the owner, temporarily
    s_ens.setSubnodeRecord(s_manageNode, label, address(this), address(s_resolver), 500);

    // Update all the records by calling the current default resolver
    results = new bytes[](data.length);
    for (uint i = 0; i < data.length; i++) {
      (bool success, bytes memory result) = address(s_resolver).call(data[i]);
      require(success, "Failed calling to ENS resolver");
      results[i] = result;
    }

    // Transfer ownership of subdomain to sender
    s_ens.setSubnodeOwner(s_manageNode, label, msg.sender);

    emit SubdomainRegistered(msg.sender, label);
    return results;
  }
}
