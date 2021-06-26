<template>
  <section>
    <b-button v-if="!isStartingProject" @click.native="startProject" id="btn"
      ><h2 class="is-title">Start A Project</h2></b-button
    >
    <b-steps
      v-if="isStartingProject"
      v-model="stepLocation"
      :has-navigation="true"
    >
      <b-step-item headerClass="has-text-black" label="Name" icon="account-key">
        <h1>What's your projects name?</h1>
        <b-input v-model="newPoolName" type="text"></b-input>
      </b-step-item>
      <b-step-item headerClass="has-text-black" label="Desc" icon="account">
        <h1>Tells us about your project.</h1>
        <b-input v-model="newPoolDesc" type="text"></b-input
      ></b-step-item>
      <b-step-item
        headerClass="has-text-black"
        label="Image"
        icon="account-plus"
      >
        <h1>Upload an Image for your project.</h1>
        <b-input v-model="newPoolFile" type="file"></b-input>
      </b-step-item>
      <b-step-item
        headerClass="has-text-black"
        label="Target Price"
        icon="account-plus"
      >
        <h1>What is your fund goal? ($)</h1>
        <b-input v-model="newPoolGoal" type="number"></b-input
      ></b-step-item>
      <b-step-item
        headerClass="has-text-black"
        label="Funding period"
        icon="account-plus"
      >
        <h1>How long would you like to raise funds for? (Day?)</h1>
        <b-input v-model="newPoolSpan" type="number"></b-input
      ></b-step-item>
      <b-step-item
        headerClass="has-text-black"
        label="Fund Booster"
        icon="account-plus"
      >
        <h1>
          Launch your NFT raise
        </h1>
        <b-button @click.native="launchPool">Launch fun-DPool</b-button>
      </b-step-item>
    </b-steps>
  </section>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      stepLocation: 5,
      isStartingProject: false,
      newPoolName: '',
      newPoolDesc: '',
      newPoolFile: '',
      newPoolGoal: 100,
      newPoolSpan: 0,
    }
  },
  methods: {
    startProject() {
      this.isStartingProject = true
    },
    launchPool() {
      let {
        newPoolName,
        newPoolDesc,
        newPoolFile,
        newPoolGoal,
        newPoolSpan,
      } = this

      fetch(this.file)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new this.$nftStorageFile([blob], 'nftdata.png', {
            type: 'image/png',
          })
          console.log(file)
          await this.sendToNftStorage(file)
        })
      let metadata = {}
      console.log({
        newPoolName,
        newPoolDesc,
        newPoolFile,
        newPoolGoal,
        newPoolSpan,
      })
    },
    async sendToNftStorage(image) {
      const today = new Date()
      const metadata = await this.$nftStorageClient.store({
        name: today.toLocaleDateString('en-US'), // 9/17/2016
        description: String(today),
        image,
      })
      console.log(metadata)
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
