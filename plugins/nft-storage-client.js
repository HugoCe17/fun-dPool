import { NFTStorage } from 'nft.storage'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default async function (context, inject) {
  inject(
    'nftStorageClient',
    await new NFTStorage({
      token: context.$config.nftStorageAPIKey,
    })
  )
}
