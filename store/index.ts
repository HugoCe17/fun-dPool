import { ActionTree, MutationTree } from 'vuex'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
// import VuexPersistence from 'vuex-persist'
import detectProvider from '@metamask/detect-provider'
import {
  SnackbarProgrammatic as Snackbar,
  ToastProgrammatic as Toast,
} from 'buefy'

export const INITIAL_STATE = {
  selectedAccount: null,
  selectedAccountEnsName: null,
  chainId: -1,
  networkId: -1,
  connected: false,
  isLoading: false,
}

export const state = () => ({ ...INITIAL_STATE })

export type RootState = ReturnType<typeof state>

// const vuexLocal = new VuexPersistence<RootState>({
//   storage: window.localStorage,
// })

export const mutations: MutationTree<RootState> = {
  resetState(state) {
    Object.assign(state, { ...INITIAL_STATE })
  },
  setState(state, _state) {
    Object.assign(state, _state)
  },
  setChainId(state, id) {
    state.chainId = id
  },
  setSelectedAccount(state, selectedAccount) {
    state.selectedAccount = selectedAccount
  },
  setSelectedAccountEnsName(state, ensName) {
    state.selectedAccountEnsName = ensName
  },
  setNetworkId(state, networkId) {
    state.networkId = networkId
  },
  setConnectedStatus(state, status) {
    state.connected = status
  },
  setLoadingStatus(state, status) {
    state.isLoading = status
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async reverseResolveAddress({ commit }, address) {
    if (!address) {
      commit('setSelectedAccountEnsName', null)
      return null
    }

    console.log('RESOLVE_ADDRESS: ', address)

    try {
      const ens = await new ENS({
        provider: await detectProvider(),
        ensAddress: getEnsAddress(4),
      })
      const ensName = await ens.getName(address)
      console.log({ ENS: ensName })
      const checked = await ens.name(ensName.name).getAddress()

      if (address.toLowerCase() !== checked.toLowerCase()) {
        commit('setSelectedAccountEnsName', null)
        return null
      } else {
        commit('setSelectedAccountEnsName', ensName.name)
        return ensName.name
      }
    } catch (error) {
      console.error('Resolving ENS name: ', Error(error).message)
    }
  },

  async connectToWallet({ commit, dispatch, state }) {
    commit('setLoadingStatus', true)
    if (state.chainId > -1 && Number(state.chainId) !== 4) {
      commit('setLoadingStatus', false)
      return Snackbar.open({
        actionText: 'OK',
        message: 'Please connect to Rinkeby',
        type: 'is-warning',
        position: 'is-top',
        duration: 10000,
        queue: false,
      })
    }

    if (state.chainId > -1 && state.selectedAccount) {
      commit('setLoadingStatus', false)

      return Toast.open({
        message: `${state.selectedAccount} \n chainId: ${Number(
          state.chainId
        )}`,
        position: 'is-top',
        duration: 10000,
        queue: false,
      })
    }

    try {
      const provider = await this.app.$web3Modal
        .connect()
        .then((provider: any) => provider)
        .catch((error: any) => console.error(error))

      //  https://github.com/ChainSafe/web3.js/issues/3891
      //  This is a work around until web3 or walletconnect get a update.
      //  Fixes issue where minting does not return receipt on callback
      //  eslint-disable-next-line no-proto
      delete provider.__proto__.request
      // eslint-disable-next-line no-prototype-builtins
      provider.hasOwnProperty('request') && delete provider.request
      // End of workaround

      if (provider) {
        await dispatch('subscribeProvider', provider)
        await this.app.$web3.setProvider(provider)

        this.app.$web3.eth.extend({
          methods: [
            {
              name: 'chainId',
              call: 'eth_chainId',
              outputFormatter: this.app.$web3.utils.hexToNumber,
            },
          ],
        })

        const accounts = await this.app.$web3.eth.getAccounts()
        const selectedAccount = accounts[0]
        const selectedAccountEnsName = await dispatch(
          'reverseResolveAddress',
          selectedAccount
        )
        const networkId = await this.app.$web3.eth.net.getId()
        const chainId = await this.app.$web3.eth.chainId()

        commit('setState', {
          selectedAccount,
          selectedAccountEnsName,
          chainId,
          networkId,
          connected: true,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      commit('setLoadingStatus', false)
    }
  },

  async disconnectWallet({ commit, dispatch, state }) {
    if (state.connected) {
      commit('setLoadingStatus', true)
      console.log('DISCONNECT')
      await dispatch('resetApp')
    }
  },

  subscribeProvider({ commit, dispatch, state }, provider) {
    if (!provider.on) {
      return console.error(
        'BAILING OUT! Provider subscription failed: ',
        provider
      )
    }

    provider.on('close', () => commit('resetState'))
    provider.on('accountsChanged', async (accounts: string[]) => {
      commit('setSelectedAccount', accounts[0])
      await dispatch('reverseResolveAddress', accounts[0])
      // TODO: fetch and set NFT ASSETS belonging to address
      // TODO: fetch and set all other User/Address related assets
    })
    provider.on('chainChanged', async (chainId: number) => {
      const networkId = await this.app.$web3.eth.net.getId()
      await dispatch('reverseResolveAddress', state.selectedAccount)
      commit('setNetworkId', networkId)
      commit('setChainId', chainId)
    })
    provider.on('networkChanged', async (networkId: number) => {
      const chainId = await this.app.$web3.eth.chainId()
      await dispatch('reverseResolveAddress', state.selectedAccount)
      commit('setNetworkId', networkId)
      commit('setChainId', chainId)
    })
  },

  async resetApp({ commit }) {
    try {
      if (
        this.app.$web3.currentProvider &&
        this.app.$web3.currentProvider.close
      ) {
        await this.app.$web3.currentProvider.close()
      }

      if (
        this.app.$web3.currentProvider &&
        this.app.$web3.currentProvider._handleDisconnect
      ) {
        await this.app.$web3.currentProvider._handleDisconnect()
      }

      await this.app.$web3Modal.clearCachedProvider()
      commit('resetState')
      this.$router.go(0)
    } catch (error) {
      console.log(error)
    } finally {
      commit('setLoadingStatus', false)
    }
  },
}

// export const plugins = [vuexLocal.plugin]
