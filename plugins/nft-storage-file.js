import { File } from 'nft.storage'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  inject('nftStorageFile', File)
}
