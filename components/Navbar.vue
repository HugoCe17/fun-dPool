<template>
  <b-navbar :mobile-burger="true" :close-on-click="false">
    <template #brand>
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
        :style="{
          'background-color': 'white',
        }"
      >
        <img :src="require('~/assets/Logo.png')" />
        <label
          class="mx-1 pa-3"
          :class="
            {
              title: $device.isDesktop,
            },
          "
          >fun-dpool</label
        >
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item
        v-for="({ to, label }, index) in navItems"
        :key="index"
        class="has-text-right"
        tag="nuxt-link"
        :to="to"
      >
        {{ label }}
      </b-navbar-item>
      <b-navbar-item
        v-if="selectedAccount || selectedAccountEnsName"
        class="is-secondary is-small has-text-right"
        @click="$store.dispatch('disconnectWallet')"
      >
        Disconnect
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item tag="div" class="actions">
        <b-button
          class="address"
          :type="selectedAccount ? 'is-secondary' : 'is-primary'"
          @click="$store.dispatch('connectToWallet')"
          ><strong>{{ cBtnLabel }}</strong></b-button
        >
        <b-button
          v-if="selectedAccount"
          class="is-primary mx-1"
          tag="nuxt-link"
          to="/app"
        >
          <strong>App</strong>
        </b-button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      navItems: [{ to: '/', label: 'Home' }],
    }
  },
  computed: {
    cBtnLabel() {
      return this.selectedAccount
        ? this.selectedAccountEnsName
          ? this.selectedAccountEnsName
          : this.truncateAddress(this.selectedAccount)
        : 'Connect'
    },
    ...mapState(['selectedAccount', 'selectedAccountEnsName']),
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
  },
}
</script>

<style scoped>
.item {
  color: #aed2ff;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.routes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
img {
  min-height: 50px;
  transform: rotate(var(--angle));
  animation: animationname 25s linear infinite;
  -webkit-animation: animationname 25s linear infinite;
  -moz-animation: animationname 25s linear infinite;
  -o-animation: animationname 25s linear infinite;
}

.address {
  display: inherit;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}
</style>
