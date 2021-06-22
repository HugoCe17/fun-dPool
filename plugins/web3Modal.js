import WalletConnectProvider from '@walletconnect/web3-provider'
import Torus from '@toruslabs/torus-embed'
import Web3Modal from 'web3modal'
import Authereum from 'authereum'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '07c05b5d099c4ad5b5d71ce38fc010e3',
      },
    },
    authereum: {
      package: Authereum,
    },
    torus: {
      package: Torus,
    },
    // fortmatic: {
    //   package: Fortmatic,
    //   options: {
    //     key: process.env.REACT_APP_FORTMATIC_KEY
    //   }
    // },

    // bitski: {
    //   package: Bitski,
    //   options: {
    //     clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
    //     callbackUrl: window.location.href + "bitski-callback.html"
    //   }
    // }
  }

  const web3Modal = new Web3Modal({
    network: 'rinkeby', // optional
    cacheProvider: true, // optional
    disableInjectedProvider: false, // optional
    providerOptions, // required
  })

  inject('web3Modal', web3Modal)
}
