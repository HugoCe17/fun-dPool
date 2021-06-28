<template>
  <section>
    <div class="container heading my-6">
      <div class="columns">
        <div class="column is-full is-family-code has-text-center">
          <h1 class="is-size-1 has-text-weight-thin ma-3">
            {{ poolDetails.name || null }}
          </h1>
          <p class="has-text-grey">{{ poolDetails.desc || null }}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column is-three-quarters p-1 mx-2">
          <b-image :src="poolDetails.image"></b-image>
        </div>
        <div class="column px-1 mx-2 is-one-quarter">
          <div class="column is-full">
            <b-progress
              type="is-success"
              :value="(balance / poolDetails.totalPrice) * 100"
              show-value
              format="percent"
            ></b-progress>
          </div>
          <div class="column is-full">
            <h1>${{ balance }} pooled of ${{ poolDetails.totalPrice }} goal</h1>
          </div>
          <div class="column is-full">
            <h1>{{ poolDetails.backers }} backers</h1>
          </div>
          <div class="column is-full">
            <h1>{{ poolDetails.deadline }} days to go</h1>
          </div>
          <div class="column mt-6 is-full">
            <b-button @click.native="contribute">Own NFT</b-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column auto px-3 my-3">
          <p>Created by {{ this.poolDetails.owner }}</p>
        </div>
        <div class="column auto px-3 my-3">
          <p>Pool Boost Rate {{ poolAPY }}%</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import fundPoolABI from '~/contracts/ABI/NFTShardPool.json'
import { KOVAN_NFTSHARDFACTORY } from '~/constants'
import { mapState } from 'vuex'

export default {
  async asyncData(context) {
    console.log(context.params.id)

    return {
      address: context.params.id,
    }
  },
  computed: {
    ...mapState(['selectedAccount']),
  },
  watch: {
    poolDetails() {},
  },
  data() {
    return {
      id: '',
      fundPool: null,
      poolAPY: 4000000,
      balance: 0,
      poolDetails: {
        backers: 420,
      },
    }
  },
  async mounted() {
    this.fundPool = await new this.$web3.eth.Contract(
      fundPoolABI.abi,
      this.address
    )
    this.balance = await this.$web3.eth.getBalance(this.address)

    await this.fundPool.methods
      .pool()
      .call()
      .then(async (res) => {
        console.log('res', res)
        const JSONMetadata = await this.$axios
          .get(res.nftURI.replaceAll('ipfs://', 'https://ipfs.io/ipfs/'))
          .then((result) => {
            this.poolDetails.image = result.data.image.replaceAll(
              'ipfs://',
              'https://ipfs.io/ipfs/'
            )
            this.poolDetails.name = result.data.name
            this.poolDetails.desc = result.data.description
          })
        this.poolDetails.startTime = res.startTime
        this.poolDetails.ERC20Token = res.ERC20Token
        this.poolDetails.deadline = res.deadline
        this.poolDetails.owner = res.owner
        this.poolDetails.totalPrice = res.totalPrice
        this.$forceUpdate()
      })
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
    contribute() {
      this.fundPool.methods
        .buyShards(1)
        .send({ from: this.selectedAccount })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
