<template>
  <Mobile v-if="isPhoneData"></Mobile>
  <Pc v-else></Pc>
</template>

<script>
import Pc from './components/Pc.vue';
import Mobile from './components/Mobile.vue';

export default {
  name: 'App',
  mounted() {
    this.isPhoneData = this.isPhone();
  },
  data () {
    return {
      isPhoneData: false
    }
  },
  methods: {
    isPhone() {
      var info = navigator.userAgent;
      var isPhone = /mobile/i.test(info);
      return isPhone;
    }
  },
  components: {
    Pc,
    Mobile
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>