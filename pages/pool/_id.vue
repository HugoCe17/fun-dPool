<template>
  <section>
    <div class="container heading my-6">
      <div class="columns">
        <div class="column is-full is-family-code has-text-center">
          <h1 class="poolHeading is-size-1 has-text-weight-thin ma-3">
            {{ poolDetails.name || null }}
          </h1>
          <p class="poolHeading has-text-grey">{{ poolDetails.desc || null }}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column imageHolder is-three-quarters p-1 mx-2">
          <img class="image" :src="poolDetails.image"></img>
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
            <h1>Ξ{{ balance }} pooled of Ξ{{ poolDetails.totalPrice }} goal</h1>
          </div>
          <div class="column is-full">
            <h1>{{ poolDetails.backers }} backers</h1>
          </div>
          <div v-if='poolDetails.status != "Closed"' class="column is-full">
            <!-- <h1>{{ poolDetails.deadline }} days to go</h1> -->
            <div v-if="clockDeadline() != null">
              <flip-countdown :deadline="clockDeadline()"></flip-countdown>
            </div>
          </div>
          <div v-if='poolDetails.status != "Closed"' class="column mt-6 is-full">
            <b-input v-model='contribution' type='number' step="any" placeholder="Contribution in Ξ"></b-input>
            <b-button :loading="contributionLoading" @click.native="contribute">Add to Pool</b-button>
          </div>
          <div v-if='poolDetails.status == "Closed"' class="column mt-6 is-full">
            <h2 class="">Pool Closed</h2>
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
    <div class="container">
      <div class="columns">
        <div class="column auto px-3 my-3"> 
          <h1>Owner Settings</h1>    
            <b-button @click.native="mintAndShard">Mint and Shard</b-button>
            <b-button @click.native="close">Close</b-button>     
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import fundPoolABI from '~/contracts/ABI/NFTShardPool.json'
import { KOVAN_NFTSHARDFACTORY } from '~/constants'
import { mapState } from 'vuex'
import FlipCountdown from 'vue2-flip-countdown'

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
  components: {
    FlipCountdown,
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
      contribution: null,
      latestBlock: {},
      events: [],
      contributionLoading: false,
      poolDetails: {
        backers: 0,
      },
    }
  },
  async mounted() {
    if (this.$web3Modal.cachedProvider) {
      await this.$store.dispatch('connectToWallet')
    }
    this.fundPool = await new this.$web3.eth.Contract(
      fundPoolABI.abi,
      this.address
    )
    this.getData()
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
    clockDeadline() {
      console.log('DUE DATE', this.poolDetails.dueDate)
      return this.timeConverter(this.poolDetails.dueDate)
    },
    contribute() {
      this.contributionLoading = true
      this.fundPool.methods
        .buyShards()
        .send({
          from: this.selectedAccount,
          value: this.$web3.utils.toWei(this.contribution),
        })
        .then((res) => {
          console.log(res)
          this.contribution = ''
          this.contributionLoading = false
          this.$buefy.toast.open({
            duration: 5000,
            message: `Your contribution has been made!`,
            position: 'is-top',
            type: 'is-success',
          })
          this.getData()
        })
        .catch((err) => {
          console.log(err)
          this.contribution = ''
          this.contributionLoading = false
        })
    },
    close() {
      this.fundPool.methods
        .closePool()
        .send({ from: this.selectedAccount })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    timeConverter(UNIX_timestamp) {
      function _addZeroBefore(n) {
        return (n < 10 ? '0' : '') + n
      }
      if (UNIX_timestamp == null) {
        return
      }
      var a = new Date(UNIX_timestamp * 1000)
      var year = a.getFullYear()
      var month = _addZeroBefore(a.getMonth() + 1)
      var date = _addZeroBefore(a.getDate())
      var hour = _addZeroBefore(a.getHours())
      var min = _addZeroBefore(a.getMinutes())
      var sec = _addZeroBefore(a.getSeconds())
      var time =
        year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec
      console.log(time)
      return time
    },
    async getData() {
      this.balance = this.$web3.utils.fromWei(
        await this.$web3.eth.getBalance(this.address)
      )
      this.latestBlock = await this.$web3.eth.getBlock('latest')

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
          this.poolDetails.deadline = (res.deadline / 86400).toFixed(0)
          this.poolDetails.owner = res.owner
          this.poolDetails.totalPrice = this.$web3.utils.fromWei(res.totalPrice)
          this.poolDetails.status = res.status
          this.poolDetails.timeRemaining =
            Number(res.startTime) +
            Number(res.deadline) -
            this.latestBlock.timestamp
          this.poolDetails.dueDate =
            Number(res.startTime) + Number(res.deadline)
          if (this.poolDetails.timeRemaining < 0) {
            this.poolDetails.status = 'Closed'
          }
          this.$forceUpdate()
        })
      console.log(this.fundPool)

      await this.fundPool.methods
        .buyers(this.selectedAccount)
        .call()
        .then((result) => {
          this.poolDetails.poolInvestment = result
        })

      await this.fundPool.methods
        .getBuyersCount()
        .call()
        .then((result) => {
          this.poolDetails.backers = result
        })
      await this.fundPool
        .getPastEvents('allEvents')
        .then((events) => {
          console.log(events)
          this.events = events
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async mintAndShard() {
      var timestamp = await this.$web3.eth.getBlock('latest')
      console.log(timestamp)
      this.fundPool.methods
        .mintNFTandShard()
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
<style>
.imageHolder {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.poolHeading {
  text-align: center;
}
</style>
