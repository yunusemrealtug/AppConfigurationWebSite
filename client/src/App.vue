<template>
  <div id="app" class="app-background">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height:100vh;
}

.app-background {
  background-color: rgb(30, 30, 40);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-top: 2px solid rgb(106, 126, 255); 
}

</style>
