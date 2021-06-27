<template>
  <section>
    <div v-for="(pool, index) in pools">
      <pool-card
        v-bind:owner="pool.owner"
        v-bind:address="pool.address"
        v-bind:name="pool.name"
        v-bind:desc="pool.desc"
        v-bind:image="pool.image"
      ></pool-card>
    </div>
  </section>
</template>

<script>
import fundPoolABI from '~/contracts/ABI/NFTShardFactory.json'
import { KOVAN_NFTSHARDFACTORY } from '~/constants'
import PoolCard from '~/components/PoolCard.vue'

export default {
  async mounted() {
    this.fundPool = await new this.$web3.eth.Contract(
      fundPoolABI.abi,
      KOVAN_NFTSHARDFACTORY
    )
    await this.getPools()
  },
  components: {
    PoolCard,
  },
  data() {
    return {
      pools: [],
    }
  },
  methods: {
    async getPools() {
      this.fundPool.methods
        .listPools()
        .call()
        .then(async (result) => {
          console.log('Get Pools Results', result)
          await this.organizePoolData(result)
          console.log(this.pools)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async organizePoolData(result) {
      console.log('contract results', result)
      const newPools = []
      result.map(async (pool) => {
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

            if (pool.id != '0') {
              let poolObject = {
                address: pool.poolAddress,
                owner: pool.poolOwner,
                name: name,
                desc: desc,
                image: image.replaceAll('ipfs://', 'https://ipfs.io/ipfs/'),
              }
              this.pools.push(poolObject)
            }
          })
      })
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
}
</style>
