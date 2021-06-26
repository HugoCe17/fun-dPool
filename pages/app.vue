<template>
  <section>
    <b-button id="btn" @click.native="startPool"
      ><h1>Start A Project</h1></b-button
    >
  </section>
</template>

<script>
import { mapState } from 'vuex'
import momintABI from '~/contracts/ABI/ERC721.json'
import { DUMMYCONTRACT_ADDRESS } from '~/constants'

export default {
  name: 'App',
  components: {},
  computed: {
    ...mapState(['selectedAccount', 'chainId']),
  },
  mounted() {
    this.momint = new this.$web3.eth.Contract(momintABI, DUMMYCONTRACT_ADDRESS)
  },
  methods: {
    startPool() {
      console.log(this.momint)
    },
  },
}
</script>

<style scoped>
section {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  margin: 0;
}
</style>
