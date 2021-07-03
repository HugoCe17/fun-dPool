<template>
  <section>
    <div class="columns heading">
      <div class="column is-full">
        <h1>Active Pools</h1>
      </div>
    </div>
    <div v-for="(pool, index) in pools" class="columns">
      <pool-card
        :owner="pool.owner"
        :address="pool.address"
        :name="pool.name"
        :desc="pool.desc"
        :image="pool.image"
      ></pool-card>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import fundPoolABI from '~/contracts/ABI/NFTShardFactory.json'
import { KOVAN_NFTSHARDFACTORY } from '~/constants'
import PoolCard from '~/components/PoolCard.vue'

export default {
  components: {
    PoolCard,
  },
  data() {
    return {
      pools: [],
      fundPool: null,
    }
  },
  computed: {
    ...mapState(['selectedAccount']),
  },
  async mounted() {
    if (this.$web3Modal.cachedProvider) {
      await this.$store.dispatch('connectToWallet')
    }
    this.fundPool = await new this.$web3.eth.Contract(
      fundPoolABI.abi,
      KOVAN_NFTSHARDFACTORY
    )
    this.fundPool.options.from = this.selectedAccount
    await this.getPools()
  },
  methods: {
    async getPools() {
      console.log(this.fundPool)
      await this.fundPool.methods
        .listPools()
        .call()
        .then(async (result) => {
          console.log('Get Pools Results', result)
          await this.organizePoolData(result)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async organizePoolData(result) {
      console.log('contract results', result)
      const newPools = []
      result.forEach(async (pool) => {
        console.log('Each pool item', pool)
        const JSONMetadata = await this.$axios
          .get(
            pool.poolNftURI.replaceAll('ipfs://', 'https://ipfs.io/ipfs/') || {}
          )
          .then((result) => {
            console.log('Request', result)
            const image = result.data.image
            const name = result.data.name
            const desc = result.data.description

            const poolObject = {
              address: pool.poolAddress,
              owner: pool.poolOwner,
              name,
              desc,
              image: image.replaceAll('ipfs://', 'https://ipfs.io/ipfs/'),
            }
            this.pools.push(poolObject)
          })
      })
      this.pools.reverse()
      console.log(newPools)
    },
  },
}
</script>

<style scoped>
.img {
  height: 25px;
  width: 25px;
}
h1 {
  font-size: 64px;
  font-weight: 200;
}
section {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: center;
}
.heading {
  width: 100vw;
  text-align: center;
}
</style>
