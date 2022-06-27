<template>
  <div class="carApp container">
    <keep-alive :include="keepPages">
      <router-view :key="key" />
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
      return this.$route.fullPath
    },
    keepPages() {
      return this.$store.getters.getKeepPages;
    },
  }
}
</script>