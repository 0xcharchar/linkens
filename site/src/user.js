import { ethers } from 'ethers'
import App from './UserApp.svelte';

async function loadProfile (subdomain) {
  const node = ethers.utils.namehash(subdomain)
  const provider = new ethers.providers.AlchemyProvider(process.env.ETHEREUM_NETWORK_KEY, process.env.ALCHEMY_API_KEY)

  const registryAbi = new ethers.utils.Interface([
    'function recordExists(bytes32 node) external virtual view returns (bool)',
    'function resolver(bytes32 node) external virtual view returns (address)',
  ]);
  const registry = new ethers.Contract('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', registryAbi, provider);

  const resolverAddr = await registry.resolver(node);
  const resolverAbi = new ethers.utils.Interface([
    'function text(bytes32 node, string calldata key) external view returns (string memory)',
    'function addr(bytes32 node, uint coinType) external view returns (bytes memory)',
  ]);
  const resolver = new ethers.Contract(resolverAddr, resolverAbi, provider);

  // check if things exist
  const subdomainExists = await registry.recordExists(node);
  if (!subdomainExists) {
    throw new Error('Subdomain does not exist');
  }

  const socialsRequests = ['com.twitter', 'com.facebook', 'com.instagram'].map(async k => {
    return { description: k, value: await resolver.text(node, k) }
  });

  const links = await Promise.all(socialsRequests);
  const avatar = await resolver.text(node, 'avatar');

  return {
    username: subdomain.split('.')[0],
    avatar,
    links
  };
}

const app = new App({
	target: document.body,
  props: {
    profilePromise: loadProfile(process.env.USER_SUBDOMAIN),
    domain: process.env.USER_SUBDOMAIN.split('.').slice(1).join('.')
  }
})

export default app
