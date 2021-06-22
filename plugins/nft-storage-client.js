import { NFTStorage } from 'nft.storage'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  inject(
    'nftStorageClient',
    new NFTStorage({
      token: context.$config.nftStorageAPIKey,
    })
  )
}
