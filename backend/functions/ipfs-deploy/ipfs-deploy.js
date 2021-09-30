'use strict'

const { Readable } = require('stream')
const pinataSdk = require('@pinata/sdk')

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env

const userPage = subdomain => `<!DOCTYPE html>
<html>
  <head>
    <title>${subdomain}</title>
  </head>
  <body>
    <h1>${subdomain}'s page</h1>
  </body>
</html>`

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

  const page = Readable.from(userPage(subdomain))
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
