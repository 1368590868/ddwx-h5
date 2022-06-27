<template>
  <keep-alive :include="keepPages">
    <router-view :key="key" />
  </keep-alive>
</template>


<script>
export default {
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.path
    },
    keepPages() {
      return this.$store.getters.getKeepPages;
    },
  },
};
</script>