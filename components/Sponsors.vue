<template>
  <section class="section is-medium gradani">
    <h1 class="has-text-centered title">Sponsors</h1>

    <div class="columns">
      <div class="column">
        <carousel autoplay :scroll-per-page="false" :per-page="4">
          <slide v-for="logo in logos" :key="logo.name">
            <img class="slide" :src="logo.path" alt="" />
          </slide>
        </carousel>
      </div>
    </div>
  </section>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel'
export default {
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      logos: [
        {
          name: 'poap',
          path: 'https://c.gitcoin.co/grants/46a5a54f3333a6a60a6ebc3f8688a94d/grande.png',
        },
        {
          name: 'ens',
          path: 'https://gblobscdn.gitbook.com/spaces%2F-LZWNj0_mU4_3ENJbw83%2Favatar.png?alt=media',
        },
        {
          name: 'dai',
          path: 'https://d2aezjsmcp2rsz.cloudfront.net/companylogos/blob_cuKrpMf',
        },
        {
          name: 'ipfs',
          path: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png',
        },
      ],
    }
  },
}
</script>
<style scoped>
img {
  max-height: 400px;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes animationname {
  to {
    --angle: 360deg;
  }
}
@-webkit-keyframes animationname {
  to {
    --angle: 360deg;
  }
}
@-moz-keyframes animationname {
  to {
    --angle: 360deg;
  }
}
@-o-keyframes animationname {
  to {
    --angle: 360deg;
  }
}

.gradani {
  border: 20px solid;
  margin: 1em;
  border-image-slice: 1;
  border-image-source: linear-gradient(var(--angle), #246655, #7957d5, #2550dd);
  animation: animationname 30s ease infinite;
  -webkit-animation: animationname 30s ease infinite;
  -moz-animation: animationname 30s ease infinite;
  -o-animation: animationname 30s ease infinite;
}
</style>
