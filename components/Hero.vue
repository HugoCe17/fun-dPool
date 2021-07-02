<template>
  <section class="hero main container">
    <div class="container">
      <div class="hero-body">
        <div class="columns holder">
          <div class="column is-three-quarters">
            <p class="title is-size-1 has-text-weight-bold">Fun-dPool</p>
            <p class="subtitle is-italic has-text-weight-light">
              Kickstart and fractionalize any NFT project with minimal cost.
            </p>
            <h1 class="is-size-2 mt-6">
              <div ref="typeEffect" style="width: 50vw"></div>
            </h1>
            <br />
          </div>
          <div class="column">
            <b-image responsive :src="require('~/assets/crypto.png')" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    // const delay = 130
    new this.$typeit(this.$refs.typeEffect, {
      speed: 90,
      startDelay: 1000,
      lifeLike: true,
      loop: true,
      loopDelay: 3000,
    })
      .type('Find a product market fit, sponsors, and community all  before minitng your NFT. ')
      .go()
  },
}
</script>
