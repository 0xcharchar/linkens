'use strict'

require('dotenv').config()

const hre = require("hardhat");
const { namehash } = require('@ensdomains/ensjs')

const { ENS_REGISTRY } = process.env
const { ethers, utils } = hre

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const tld = 'test'

function labelhash (label) { 
  return utils.keccak256(utils.toUtf8Bytes(label))
}

async function setup (shouldCompile = false) {
  if (shouldCompile) {
    await hre.run('compile')
  }

  const ENSRegistry = await ethers.getContractFactory("ENSRegistry")
  const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar")
  const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar")
  const PublicResolver = await ethers.getContractFactory("PublicResolver")
  const signers = await ethers.getSigners();
  const accounts = signers.map(s => s.address)

  const ens = await ENSRegistry.deploy()
  await ens.deployed()
  const resolver = await PublicResolver.deploy(ens.address, ZERO_ADDRESS);
  await resolver.deployed()
  await setupResolver(ens, resolver, accounts)
  const registrar = await  FIFSRegistrar.deploy(ens.address, namehash.hash(tld));
  await registrar.deployed()
  await setupRegistrar(ens, registrar);
  const reverseRegistrar = await ReverseRegistrar.deploy(ens.address, resolver.address);
  await reverseRegistrar.deployed()
  await setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts);

  return { resolverAddr: resolver.address }
}

async function setupResolver(ens, resolver, accounts) {
  const resolverNode = namehash.hash("resolver");
  const resolverLabel = labelhash("resolver");
  await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver['setAddr(bytes32,address)'](resolverNode, resolver.address);
}

async function setupRegistrar(ens, registrar) {
await ens.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
}

async function setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts) {
  await ens.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), accounts[0]);
  await ens.setSubnodeOwner(namehash.hash("reverse"), labelhash("addr"), reverseRegistrar.address);
}

async function siteManager({ resolverAddr }) {
  const Contract = await ethers.getContractFactory('SiteManager');
  const siteManager = await Contract.deploy(
    ENS_REGISTRY,
    resolverAddr,
    namehash('eo2021char.eth')
  );

  await siteManager.deployed();

  console.log("SiteManager deployed to:", siteManager.address);
}

// useful when run from node
const args = process.argv.slice(2)

setup(!!args[0])
  .then(siteManager)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
