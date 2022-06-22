<template>
  <div class="carApp container">
    <keep-alive :include="keepPages">
      <router-view />
    </keep-alive>
  </div>
</template>


<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    keepPages() {
      return this.$store.getters.getKeepPages;
    },
  }
}
</script>