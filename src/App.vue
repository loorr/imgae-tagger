<template>
  <router-link to="/"></router-link>
  <router-view></router-view>
</template>

<script setup lang="ts">
  import MainPage from "./pages/MainPage.vue";

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
