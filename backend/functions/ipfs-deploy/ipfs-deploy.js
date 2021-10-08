'use strict'

const { Readable } = require('stream')
const fs = require('fs/promises')
const pinataSdk = require('@pinata/sdk')

const { ALCHEMY_API_KEY, PINATA_API_KEY, PINATA_API_SECRET } = process.env

const userPage = (subdomain, alchemy) => `<!DOCTYPE html>
<html> <head> <title>${subdomain}</title> <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script> <style>/** global.css **/ html, body{position: relative; width: 100%; height: 100%; box-sizing: border-box;}*, *:before, *:after{box-sizing: inherit;}body{color: #333; margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;}a{color: rgb(0,100,200); text-decoration: none;}a:hover{text-decoration: underline;}a:visited{color: rgb(0,80,160);}</style> <style>#content{display: none;}#loading{display: flex; flex-direction: column; justify-content: center; margin: 0; padding: 0; width: 100vw; height: 100vh; font-size: 3em; text-align: center;}#avatar{display: block; width: 15ch; height: 15ch; margin: 0 auto; border-radius: 50%; border: 3px solid #000; background: #f5f5f5; overflow: hidden;}img{width: 100%;}#banner{padding: 1em 0; text-align: center; background: #464646; color: #f5f5f5;}ul{list-style-type: none; padding: 0; margin: 1em 0; display: flex; flex-direction: column; justify-content: space-evenly;}a{display: block; margin: 0.5em; padding: 1em; text-align: center; background: #f5f5f5; border: 3px solid #464646; color: #464646;}</style> </head> <body> <div id="loading"><p>Loading</p></div><div id="content"> <section id="banner"> <div id="avatar"> </div></section> <section id="body"> <ul id="profile-links"> </ul> </section> </div><script>const ENS_SUBDOMAIN='${subdomain}'; const node=ethers.utils.namehash(ENS_SUBDOMAIN); const provider=new ethers.providers.AlchemyProvider('ropsten', '${alchemy}'); /* TODO reverse look up subdomain, get resolver */ const resolverAbi=new ethers.utils.Interface([ 'function text(bytes32 node, string calldata key) external view returns (string memory)',]); const resolver=new ethers.Contract('0x42D63ae25990889E35F215bC95884039Ba354115', resolverAbi, provider); const textTranslate={'com.instagram':{handler: h=> `https://instagram.com/${h}`, pretty: 'Instagram'}, 'com.twitter':{handler: h=> `https://twitter.com/${h.startsWith('@') ? h : '@'+h}`, pretty: 'Twitter'}, 'com.facebook':{handler: h=> `https://facebook.com/${h}`, pretty: 'Facebook'}}; const toGateway=cid=> `https://gateway.pinata.cloud/ipfs/${cid}`; async function loadProfile (){const socialsRequests=['com.twitter', 'com.facebook', 'com.instagram'].map(async k=>{return{type: k, value: await resolver.text(node, k)}}) const links=await Promise.all(socialsRequests) const avatar=await resolver.text(node, 'avatar') return{name: ENS_SUBDOMAIN.split('.')[0], avatar: avatar ? toGateway(avatar) : '', links}}function buildBanner (profile){if (profile.avatar){const img=document.createElement('img') img.src=profile.avatar const avatarContainer=document.getElementById('avatar') avatarContainer.appendChild(img)}const heading=document.createElement('h1') heading.appendChild(document.createTextNode(profile.name)) const banner=document.getElementById('banner') banner.appendChild(heading)}function buildLinks (links){const listEl=links.map(({type, value})=>{const listItem=document.createElement('li') const anchor=document.createElement('a') anchor.href=textTranslate[type].handler(value) const linkText=document.createTextNode(`${value}on ${textTranslate[type].pretty}`) anchor.appendChild(linkText) listItem.appendChild(anchor) return listItem}) const profileLinks=document.getElementById('profile-links') listEl.forEach(item=> profileLinks.appendChild(item))}loadProfile() .then(profile=>{buildBanner(profile) buildLinks(profile.links)}) .then(()=>{const loadingEl=document.getElementById('loading') loadingEl.style.display='none' const content=document.getElementById('content') content.style.display='block'}) .catch(err=> console.log('the error', err)); </script> </body></html>`

const cors = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  },
  statusCode: 200,
  body: 'preflight'
}

const handler = async (event) => {
  const { httpMethod, body, isBase64Encoded } = event

  if (httpMethod === 'OPTIONS') return cors

  if (httpMethod !== 'POST') return { statusCode: 404, body: 'Route not found' }

  const { subdomain } = JSON.parse(isBase64Encoded ? Buffer.from(body, 'base64').toString() : body)

  const page = Readable.from(userPage(subdomain, ALCHEMY_API_KEY))
  page.path = 'index.html' // Required for pinFileToIPFS to work

  const pinataOpts = {
    pinataMetadata: { 
      name: `${subdomain} Profile Page`,
      keyvalues: {
        hackathon: 'ethonline2021',
        type: 'profile-page'
      }
    }
  }

  try {
    const pinata = pinataSdk(PINATA_API_KEY, PINATA_API_SECRET)
    const { IpfsHash } = await pinata.pinFileToIPFS(page, pinataOpts)

    console.log('the hash', IpfsHash)

    return {
      statusCode: 200,
      body: JSON.stringify({ hash: IpfsHash }),
      isBase64Encoded: false,
      headers: cors.headers
    }
  } catch (error) {
    console.error('the error', error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
