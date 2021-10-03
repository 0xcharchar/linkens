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

  /**
    * The PublicResolver that ENS uses does not allow to set the approval to self (makes sense I guess)
    * Operators (the approved actors) are stored as operator[ownerAddr][operatorAddr] thus setting self
    * and then changing owner will not work so good
    *
    * Maybe need a custom registry and custom resolver to set access correctly. We want the owner to be
    * the person who requested the registry so that they are able to replace our dapp/contract with
    * someone elses, easily. We also want the registration to happen in the least amount of transactions
    * because having to go to the wallet more than once to do "one thing" (create a site) is no good.
    */

  function subdomainRegister (bytes32 label, bytes[] calldata data) external returns (bytes[] memory) {
    s_ens.setSubnodeRecord(s_manageNode, label, address(this), address(s_resolver), 500);
    s_ens.setApprovalForAll(address(this), true); // TODO probably not going to work
    bytes[] memory results = s_resolver.multicall(data);
    s_ens.setOwner(msg.sender); // TODO probably not going to work

    emit SubdomainRegistered(msg.sender, label);
    return results;
  }
}
