'use strict'

const path = require('path')
const { getFilesFromPath, File, Web3Storage } = require('web3.storage')

// load files from user-site
// search bundle.[hash].js for {{USER_SUBDOMAIN}}
// replace {{USER_SUBDOMAIN}} with provided subdomain


const cors = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST'
  },
  statusCode: 200,
  body: 'preflight'
}

const streamString = async (stream) => {
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf-8')
}

const handler = async (event) => {
  const { httpMethod, body, isBase64Encoded } = event

  if (httpMethod === 'OPTIONS') return cors

  if (httpMethod !== 'POST') return { statusCode: 404, body: 'Route not found' }

  const { subdomain } = JSON.parse(isBase64Encoded ? Buffer.from(body, 'base64').toString() : body)
  // TODO subdomain should be normalized to remove possible attack vectors

  const files = (await getFilesFromPath(path.join(process.cwd(), 'user-site'))).map(async (file) => {
    if (!file.name.startsWith('/user-site/bundle.') && !file.name.endsWith('.js')) return file

    const contents = await streamString(file.stream())
    const patched = contents.replace('{{USER_SUBDOMAIN}}', subdomain)

    return new File(patched, file.name, { type: file.type })
  })

  try {
    const ipfsClient = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY })
    const cid = await ipfsClient.put(await Promise.all(files), {
      name: subdomain,
      maxRetries: 2,
      wrapWithDirectory: false
    })
    console.log(`Saved ${subdomain} as ${cid}`)

    return {
      statusCode: 200,
      body: JSON.stringify({ hash: cid }),
      isBase64Encoded: false,
      headers: cors.headers
    }
  } catch (error) {
    console.error('the error', error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
