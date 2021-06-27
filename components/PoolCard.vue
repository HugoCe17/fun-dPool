<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="image" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="image" alt="Placeholder image" />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{ name }}</p>
          <p class="subtitle is-6">
            <time datetime="2016-1-1">created by {{ owner }}</time>
          </p>
        </div>
      </div>

      <div class="content">
        {{ desc }}
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import fundPoolABI from '~/contracts/ABI/NFTShardFactory.json'
import { KOVAN_NFTSHARDFACTORY } from '~/constants'

export default {
  mounted() {
    this.fundPool = new this.$web3.eth.Contract(
      fundPoolABI.abi,
      KOVAN_NFTSHARDFACTORY
    )
    console.log(this.image)
  },
  props: ['address', 'owner', 'name', 'desc', 'image'],
}
</script>
<style scoped>
.card {
  margin: 15px;
}
</style>
