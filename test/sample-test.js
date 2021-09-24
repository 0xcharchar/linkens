const { expect } = require("chai");
const { ethers } = require("hardhat");
const { labelhash, namehash } = require('@ensdomains/ensjs')
const { ENSRegistry, FIFSRegistrar } = require('@ensdomains/ens-contracts')

async function deployEns (root = 'ethonline2021char') {
  const ENS = await ethers.getContractFactory('ENSDeployer')
  const ens = await ENS.deploy()
  await ens.deployed();

  const [owner] = await ethers.getSigners()
  const registrar = new ethers.Contract(await ens.fifsRegistrar(), FIFSRegistrar, owner)

  const tx = await registrar.connect(owner).register(labelhash(root), await owner.getAddress())
  await tx.wait()

  return {
    registryAddr: await ens.ens(),
    resolverAddr: await ens.publicResolver()
  }
}

async function deploySiteManager (registryAddr, resolverAddr, root = 'ethonline2021char') {
  const SiteManager = await ethers.getContractFactory('SiteManager')
  const sm = await SiteManager.deploy(registryAddr, resolverAddr, namehash(`${root}.eth`))
  await sm.deployed()

  const [owner] = await ethers.getSigners()
  const registry = new ethers.Contract(registryAddr, ENSRegistry, owner)

  const approveTx = await registry.connect(owner).setApprovalForAll(sm.address, true)
  await approveTx.wait()

  return sm
}

describe('SiteManager', function () {
  it('should be able to register a subdomain', async function () {
    const { registryAddr, resolverAddr } = await deployEns()
    const siteManager = await deploySiteManager(registryAddr, resolverAddr)

    const [, testAcct] = await ethers.getSigners()
    const regTx = await siteManager.connect(testAcct).subdomainRegister(labelhash('test'))
    await regTx.wait()

    const registry = new ethers.Contract(registryAddr, ENSRegistry, testAcct)
    const nodeOwner = await registry.connect(testAcct).owner(namehash('test.ethonline2021char.eth'))

    // the person who requested the subdomain is the owner
    expect(nodeOwner).to.be.eq(await testAcct.getAddress())

    // TODO can this be done from SiteManager?
    // the SiteManager should be the controller (operator in contract terms)
    const mgrIsController = await registry.connect(testAcct).isApprovedForAll(nodeOwner, await testAcct.getAddress())
    expect(mgrIsController).to.be.true
  })
})
