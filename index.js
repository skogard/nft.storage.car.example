require('dotenv').config()
const { packToFs } = require('ipfs-car/pack/fs')
const { CarIndexedReader } = require('@ipld/car')
const { NFTStorage, File } = require('nft.storage')
const token = process.env.NFT_STORAGE_KEY
const fs = require('fs')
const storage = new NFTStorage({ token })
const upload = async (folderPath) => {
  console.log("packing...")
  const { root } = await packToFs({
    input: folderPath,
    output: `${process.cwd()}/output.car`,
  })
  const expectedCid = root.toString()
  console.log({ expectedCid })
  const carReader = await CarIndexedReader.fromFile(
    `${process.cwd()}/output.car`
  )
  console.log("Uploading...")
  const cid = await storage.storeCar(carReader)
  console.log("CID", cid)
}
(async () => {
  await upload("metadata")
  process.exit()
})();
