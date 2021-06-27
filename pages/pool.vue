<template>
  <section>
    <div class="container heading my-6">
      <div class="columns">
        <div class="column is-full is-family-code has-text-center">
          <h1 class="is-size-1 has-text-weight-thin ma-3">
            {{ poolName || null }}
          </h1>
          <p class="has-text-grey">{{ poolDescription || null }}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column is-three-quarters p-1 mx-2">
          <b-image
            src="https://publish.one37pm.net/wp-content/uploads/2021/02/how-to-buy-a-cryptopunk_0000_02.jpg?fit=636%2C424"
          ></b-image>
        </div>
        <div class="column px-1 mx-2 is-one-quarter">
          <div class="column is-full">
            <b-progress
              type="is-success"
              :value="(poolAmount / poolGoal) * 100"
              show-value
              format="percent"
            ></b-progress>
          </div>
          <div class="column is-full">
            <h1>${{ poolAmount }} pooled of ${{ poolGoal }} goal</h1>
          </div>
          <div class="column is-full">
            <h1>{{ poolBackers }} backers</h1>
          </div>
          <div class="column is-full">
            <h1>{{ poolDaysLeft }} days to go</h1>
          </div>
          <div class="column mt-6 is-full">
            <b-button @click.native="startPool">Own NFT</b-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column auto px-3 my-3">
          <p>Created by {{ truncateAddress(poolCreator) }}</p>
        </div>
        <div class="column auto px-3 my-3">
          <p>Pool Boost Rate {{ poolAPY }}%</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      momint: null,
      poolName: 'Cryptopunk #9442',
      poolAmount: 100000,
      poolGoal: 350000,
      poolBackers: 420,
      poolDaysLeft: 5,
      poolAPY: 800000,
      poolCreator: '0xDE29485dF7e941866442ceb25DCe1b9c64D02A26',
      poolDescription:
        'Cryptopunks is an NFT project released on the Ethereum blockchain by Larva Labs, and consists of 10,000 unique pixelated characters. Some are human, some aliens, some zombies and some apes.',
    }
  },
  computed: {
    ...mapState(['selectedAccount', 'chainId']),
  },
  async mounted() {
    setInterval(() => {
      this.poolAmount =
        this.poolAmount +
        (this.poolAmount * (this.poolAPY / 100)) / 365 / 24 / 60 / 60
      this.poolBackers++
    }, 1000)
    console.log(await this.$web3.currentProvider.accounts[0])
  },
  methods: {
    truncateAddress(address) {
      if (address.length > 0) {
        return (
          address.substring(0, 4) +
          '....' +
          address.substring(address.length - 5, address.length)
        )
      } else {
        return address
      }
    },
  },
}
</script>
<style scoped>
.heading {
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
