//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

import "hardhat/console.sol";

contract SiteManager {
  ENS private immutable s_ens;
  PublicResolver private immutable s_resolver;
  bytes32 private immutable s_manageNode;

  event SubdomainRegistered (address owner, bytes32 indexed label);

  constructor(ENS _registryAddr, PublicResolver _resolverAddr, bytes32 _manageNode) {
    s_ens = _registryAddr;
    s_resolver = _resolverAddr;
    s_manageNode = _manageNode;
  }

  function subdomainRegister (bytes32 label, bytes[] calldata data) external returns (bytes[] memory) {
    // Create the subdomain through this contract so that it is the owner
    s_ens.setSubnodeRecord(s_manageNode, label, address(this), address(s_resolver), 500);

    // Update all the records
    bytes[] memory results = s_resolver.multicall(data);

    // Transfer ownership of subdomain to sender
    s_ens.setSubnodeOwner(s_manageNode, label, msg.sender);

    emit SubdomainRegistered(msg.sender, label);
    return results;
  }
}
