<template>
  <router-view />
</template>

<script setup>
// App component không cần xử lý logic bổ sung
</script>

<style>
/* Global styles */
:root {
  color-scheme: dark;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: inherit;
  text-decoration: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>