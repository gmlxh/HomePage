<template>
  <div class="background"></div>
  <router-view /> <footer>
  <span>© 2025 Made in <a href="/" target="_blank">{{ userName }}</a></span>
  <a v-if="icpNumber" href="https://beian.miit.gov.cn/" target="_blank">{{ icpNumber }}</a>
  <a v-if="policenumber" :href="`https://beian.mps.gov.cn/#/query/webSearch?police=${policenumber}`" target="_blank" class="police_link">
    <span class="police_img"></span> {{ policenumber }}
  </a>
</footer>
</template>

<script setup>
import { ref } from 'vue';

const userName = ref(import.meta.env.VITE_APP_USER_NAME);
const icpNumber = ref(import.meta.env.VITE_APP_ICP_NUMBER);
const policenumber = ref(import.meta.env.VITE_APP_POLICE_NUMBER);
</script>