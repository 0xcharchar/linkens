# ETHOnline 2021 - LinkENS

LinkENS is a dapp for creators to deploy their own link aggregator website, backed by ENS.

_This project was built as part of the [ETHOnline 2021 Hackathon](https://showcase.ethglobal.com/ethonline2021)._

Content:

* [Links](#links)
* [About](#about)
* [Architecture](#architecture)
  * [Contracts](contracts/README.md)
  * [Dapp](site/README.md)
  * [Backend](backend/README.md)
* [Setup](#setup)

## Links

* [Project page](https://showcase.ethglobal.com/ethonline2021/linkens)
* [Live demo on Ropsten](https://bafybeifcefgqrfqaavabrnxguinedbruxi5ok5zpnvnngww4kbrqhvrhku.ipfs.dweb.link/)(active until Sept 2022)
* [Video demo](https://peertube.co.uk/videos/watch/828f8d20-45d2-4157-b29c-1c7b5c4943b9)
* [Slides](docs/judging-slides.odp)

## About

This dapp allows a user to create their own link aggregator website on Web3. It
is an MVP version of Linktr.ee but entirely decentralized. With the app being
decentralized, we are able to give the user complete ownership of their data
and the ability to have a site without worrying about hosting.

## Architecture

There are four key components:

* the dapp
* the custom ENS registrar
* the user sites
* the site deployer

![Architecture diagram showing flow through system](docs/overall.png "Architecture diagram")

The dapp is a Svelte SPA that lives on IPFS. It is automatically deployed by
Fleek on every push to `main`.

The smart contract is the controller of the main ENS node (ethonline2021char.eth)
and is used to register subnodes. After the subnode is registered, the
PublicResolver is updated with any text records that were passed to the function.
This process works exactly like `multicall` (a function on PublicResolver).
Once all of the records are updated, ownership is transferred from the smart
contract to the `msg.sender`.

Prior to the registrar being called, an HTML file is deployed to IPFS
(via web3.storage). This HTML file has the users chosen subdomain hardcoded into
the file. When loaded in a browser, the embedded javascript will use the
subdomain to pull ENS text records off the blockchain (via Alchemy API).

This HTML file is deployed by Netlify Functions as a way to hide the web3.storage API token.

## Setup

A domain needs to be registered with ENS to use this application.
Visit https://app.ens.domains and register a node on either mainnet or a
testnet.
