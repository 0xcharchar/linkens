import { writable } from 'svelte/store'
import { ethers } from 'ethers'
import Onboard from 'bnc-onboard'

export const provider = writable(null)
export const address = writable('')
export const ens = writable({ name: '', avatar: '' })
export const connected = writable(false)

const rpcUrl = process.env.ALCHEMY_API_RPC_URL
const onboard = Onboard({
  dappId: process.env.BLOCKNATIVE_API_KEY,
  networkId: 3,

  subscriptions: {
    address: addressVal => address.set(addressVal || ''),
    ens: ensVal => ens.set(ensVal || {}),
    wallet: wallet => {
      if (!wallet) {
        provider.set(null)
        connected.set(false)
      }

      provider.set(new ethers.providers.Web3Provider(wallet.provider))
    }
  },

  walletSelect: {
    wallets: [
      { walletName: 'metamask' },
      {
        walletName: 'walletConnect',
        infuraKey: process.env.INFURA_PROJECT_ID
      },
      {
        walletName: 'trezor',
        appUrl: 'https://linkens.xyz',
        email: 'team@linkens.xyz',
        rpcUrl
      },
      {
        walletName: 'ledger',
        rpcUrl
      }
    ]
  }
})

export async function connectWallet () {
  const selected = await onboard.walletSelect()
  if (!selected) return /* TODO show an error */

  const walletConnected = await onboard.walletCheck()
  connected.set(walletConnected)
  if (!walletConnected) return /* TODO show an error */
}
