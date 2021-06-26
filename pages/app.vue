<template>
  <section>
    <create-pool />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import momintABI from '~/contracts/ABI/ERC721.json'
import { DUMMYCONTRACT_ADDRESS } from '~/constants'
import CreatePool from '~/components/CreatePool.vue'

export default {
  name: 'app',
  components: {
    CreatePool,
  },
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
