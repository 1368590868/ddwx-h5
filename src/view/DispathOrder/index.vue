<template>
  <div class="carApp container">
    <router-view />
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