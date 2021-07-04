<template>
  <section>
    <b-button v-if="!isStartingProject" id="btn" @click.native="startProject"
      ><h2 class="is-title">Start A Project</h2></b-button
    >
    <b-steps
      v-if="isStartingProject"
      v-model="stepLocation"
      :has-navigation="true"
    >
      <b-step-item
        header-class="has-text-black"
        label="Name"
        icon="account-key"
      >
        <h1>What's your projects name?</h1>
        <b-input v-model="newPoolName" type="text"></b-input>
      </b-step-item>
      <b-step-item header-class="has-text-black" label="Desc" icon="account">
        <h1>Tells us about your project.</h1>
        <b-input v-model="newPoolDesc" type="text"></b-input
      ></b-step-item>
      <b-step-item
        header-class="has-text-black"
        label="Image"
        icon="account-plus"
      >
        <h1>Upload an Image for your project.</h1>
        <b-upload v-model="newPoolFile" drag-drop>
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"> </b-icon>
              </p>
              <span class="file-label">{{
                newPoolFile.name || 'Drop your files here or click to upload'
              }}</span>
            </div>
          </section>
        </b-upload>
      </b-step-item>
      <b-step-item
        header-class="has-text-black"
        label="Target Price"
        icon="account-plus"
      >
        <h1>What is your fund goal? (Ξ)</h1>
        <b-input v-model="newPoolGoal" type="number"></b-input
      ></b-step-item>
      <b-step-item
        header-class="has-text-black"
        label="Funding period"
        icon="account-plus"
      >
        <h1>How long would you like to raise funds for? (Days)</h1>
        <b-input v-model="newPoolSpan" type="number"></b-input
      ></b-step-item>
      <b-step-item
        header-class="has-text-black"
        label="Fund Booster"
        icon="account-plus"
      >
        <h1>Launch your NFT raise</h1>
        <b-button :loading="createPoolLoading" @click.native="launchPool"
          >Launch fun-DPool</b-button
        >
      </b-step-item>
    </b-steps>
  </section>
</template>

<script>
import { mapState } from 'vuex'

import fundPoolABI from '~/contracts/ABI/NFTShardFactory2.json'
import { KOVAN_NFTSHARDFACTORY } from '~/constants'

import singleFundPoolABI from '~/contracts/ABI/NFTShardPoolP.json'


export default {
  data() {
    return {
      fundPool: null,
      stepLocation: 0,
      isStartingProject: false,
      newPoolName: '',
      newPoolDesc: '',
      newPoolFile: {},
      newPoolGoal: '1',
      newPoolSpan: 0,
      createPoolLoading: false,
    }
  },
  computed: {
    ...mapState(['selectedAccount']),
  },
  mounted() {
    this.fundPool = new this.$web3.eth.Contract(
      fundPoolABI.abi,
      KOVAN_NFTSHARDFACTORY
    )
    console.log("Contract",this.fundPool)
  },
  methods: {
    startProject() {
      this.isStartingProject = true
      console.log(this.fundPool)
    },
    async launchPool() {
      this.createPoolLoading = true
      const {
        newPoolName,
        newPoolDesc,
        newPoolFile,
        newPoolGoal,
        newPoolSpan,
      } = this

      const formData = {
        newPoolName,
        newPoolDesc,
        newPoolFile,
        newPoolGoal,
        newPoolSpan,
      }
      if (formData != null) {
        console.log(formData)
        await this.sendToNftStorage(formData)
      }
    },
    async sendToNftStorage(formData) {
      console.log(formData.newPoolFile, 'being uploaded')
      if (
        formData.newPoolFile &&
        formData.newPoolName &&
        formData.newPoolDesc &&
        formData.newPoolGoal &&
        formData.newPoolSpan
      ) {
        const metadata = await this.$nftStorageClient.store({
          name: formData.newPoolName,
          description: formData.newPoolDesc,
          image: formData.newPoolFile,
        })
        console.log("METADATA",metadata)
        this.createPool(metadata)
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Something's not good, missing input fields`,
          position: 'is-bottom',
          type: 'is-danger',
        })
      }
    },
    async createPool(metadata) {
      await this.fundPool.methods
        .createPool(
          this.newPoolName,
          metadata.url,
          String(this.$web3.utils.toWei(this.newPoolGoal)),
          String(100),
          String((this.newPoolSpan * 86400).toFixed(0))
        )
        .send({ from: this.selectedAccount })
        .then(async (result) => {
          console.log(result)
          this.$buefy.toast.open({
            duration: 5000,
            message: `Your funDpool has been created!`,
            position: 'is-top',
            type: 'is-success',
          })
          let addy = result.events['0'].raw.topics[2]
          let parsedAddy =
            addy.substring(0, 2) + addy.substring(26, addy.length)
          this.singleFundPool = await new this.$web3.eth.Contract(
            singleFundPoolABI.abi,
            parsedAddy
          )
          await this.$axios.get("https://api-staging.rarible.com/protocol/v0.1/ethereum/nft/collections/0x6ede7f3c26975aad32a475e1021d8f6f39c89d82/generate_token_id?minter=" + parsedAddy)
          .then(async (result) => {
            await this.singleFundPool.methods.setTokenId(result.data.tokenId)
            .send({ from: this.selectedAccount })
            .then((result) => {
              console.log(result)
              this.createPoolLoading = false

            })

          })
          this.$router.push('/pool/' + parsedAddy)
        })
        .catch((err) => {
          console.log(err)
          this.createPoolLoading = false
        })
    },
    getPools() {
      this.fundPool.methods
        .listPools()
        .call()
        .then((result) => {
          console.log(result)
        })
        .catch((err) => {
          console.log(err)
        })
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
</style>
