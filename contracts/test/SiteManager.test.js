const { expect } = require("chai");
const { ethers } = require("hardhat");
const { labelhash, namehash } = require('@ensdomains/ensjs')
const { ENSRegistry } = require('@ensdomains/ens-contracts')

const TLD = 'eth'
const DOMAIN = 'linkens'

const domain = () => `${DOMAIN}.${TLD}`

async function ensDeployer () {
  const [owner] = await ethers.getSigners()

  // deploy registry
  const ensFactory = await ethers.getContractFactory('ENSRegistry')
  const ens = await ensFactory.deploy()

  // deploy resolver
  const resolverFactory = await ethers.getContractFactory('PublicResolver')
  const resolver = await resolverFactory.deploy(ens.address, ethers.constants.AddressZero)

  // magic base resolver
  const resolverNode = namehash('resolver')
  const resolverLabel = ethers.utils.id('resolver')
  await ens.setSubnodeOwner(ethers.constants.HashZero, resolverLabel, await owner.getAddress())
  await ens.setResolver(resolverNode, resolver.address)
  await resolver['setAddr(bytes32,uint256,bytes)'](resolverNode, 60, resolver.address)

  // create TLD
  await ens.setSubnodeOwner(ethers.constants.HashZero, ethers.utils.id(TLD), await owner.getAddress())

  return {
    registry: ens,
    resolver: resolver
  }
}

async function deploySiteManager (registry, resolver) {
  const [owner] = await ethers.getSigners()

  // create domain record
  await registry.setSubnodeOwner(namehash(TLD), labelhash(DOMAIN), await owner.getAddress())

  // deploy SiteManager
  const SiteManager = await ethers.getContractFactory('SiteManager')
  const sm = await SiteManager.deploy(registry.address, resolver.address, namehash(`${domain()}`))
  await sm.deployed()

  // allow SiteManager to make calls on behalf of owner
  const approveTx = await registry.connect(owner).setApprovalForAll(sm.address, true)
  await approveTx.wait()

  return sm
}

describe('SiteManager', function () {
  it('should be able to register a subdomain', async function () {
    const { registry, resolver } = await ensDeployer()
    const siteManager = await deploySiteManager(registry, resolver)

    const [, testAcct] = await ethers.getSigners()
    const regTx = await siteManager.connect(testAcct).subdomainRegister(labelhash('test'), [])
    await regTx.wait()

    const nodeOwner = await registry.connect(testAcct).owner(namehash(`test.${domain()}`))

    // the person who requested the subdomain is the owner
    expect(nodeOwner).to.be.eq(await testAcct.getAddress())
  })
})
