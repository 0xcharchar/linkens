'use strict'

const path = require('path')
const { promisify } = require('util')
const { finished, Writable } = require('stream')

const { getFilesFromPath, File, Web3Storage } = require('web3.storage')
const uts46 = require('idna-uts46-hx')
const replacestream = require('replacestream')

const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

const finishedAsync = promisify(finished)

const cors = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST'
  },
  statusCode: 200,
  body: 'preflight'
}

const asciiEns = username => uts46.toAscii(username, { transitional: false, useStd3ASCII: true })
const onlyAlphanumeric = username => username.replace(/[^a-z0-9]/ig, '')
const formatLabel = pipe(onlyAlphanumeric, asciiEns)

const toFile = (name, finishCb) => {
  const writer = new Writable()

  const chunks = []
  writer._write = (chunk, enc, next) => {
    chunks.push(chunk)
    next()
  }

  writer.on('finish', () => {
    const f = new File(chunks, name)
    finishCb(f)
  })

  return writer
}

const handler = async (event) => {
  const { httpMethod, body, isBase64Encoded } = event

  if (httpMethod === 'OPTIONS') return cors

  if (httpMethod !== 'POST') return { statusCode: 404, body: 'Route not found' }

  const { subdomain } = JSON.parse(isBase64Encoded ? Buffer.from(body, 'base64').toString() : body)
  const sanitizedSubdomain = `${formatLabel(subdomain.split('.')[0])}.ethonline2021char.eth`

  const files = (await getFilesFromPath(path.join(process.cwd(), 'user-site'))).map(async (file) => {
    // Only care about the bundle.js file, everything else remains unchanged
    if (!file.name.match(/\/user-site\/bundle\.[a-z0-9]*\.[0-9]{1,3}\.js/g)) return file

    const reader = file.stream()
    let patchedFile
    const writer = toFile(file.name, (patched) => {
      patchedFile = patched
    })

    reader.on('close', () => writer.end())

    reader
      .pipe(replacestream('{{USER_SUBDOMAIN}}', sanitizedSubdomain))
      .pipe(writer)

    await finishedAsync(writer)

    return patchedFile
  })

  try {
    const ipfsClient = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY })

    const siteFiles = await Promise.all(files)

    const cid = await ipfsClient.put(siteFiles, {
      name: sanitizedSubdomain,
      maxRetries: 2,
      wrapWithDirectory: false
    })
    console.log(`Saved ${sanitizedSubdomain} as ${cid}`)

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
