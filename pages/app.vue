<template>
  <section>
    <create-pool />
    <pools />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import CreatePool from '~/components/CreatePool.vue'
import Pools from '~/components/Pools.vue'

export default {
  name: 'app',
  components: {
    CreatePool,
    Pools,
  },
  computed: {
    ...mapState(['selectedAccount', 'chainId']),
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped>
/* section {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  margin: 0;
} */
</style>
