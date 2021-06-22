<template>
  <div>
    <b-loading
      :is-full-page="true"
      :value="isLoading"
      :can-cancel="true"
    ></b-loading>
    <section class="main-content">
      <navbar v-if="$route.name !== 'Camera'" />
      <div>
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Navbar from '~/components/Navbar'

export default {
  components: { Navbar },
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' },
        },
      ],
    }
  },

  computed: {
    ...mapState(['selectedAccount', 'chainId', 'isLoading']),
  },

  mounted() {
    this.$web3Modal.cachedProvider && this.$store.dispatch('connectToWallet')
  },

  destroyed() {
    this.$web3.currentProvider &&
      this.$web3.currentProvider.removeAllListeners()
  },

  methods: {
    ...mapMutations([
      'setChainId',
      'setSelectedAccount',
      'setSelectedAccountEnsName',
      'disableConnectButton',
      'resetState',
    ]),
  },
}
</script>
