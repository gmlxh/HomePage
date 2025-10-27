<template>
  <div class="background"></div>
  <router-view /> <footer>
  <span>Copyright © {{ currentYear }} <a href="/" target="_blank">{{ userName }}</a>. All Rights Reserved.</span>
  <a v-if="icpNumber" :href="`https://beian.miit.gov.cn`" target="_blank">{{ icpNumber }}</a>
  <a v-if="policenumber" :href="`https://beian.mps.gov.cn/#/query/webSearch?police=${policeDigits}`" target="_blank" class="police_link">
    <span class="police_img"></span> {{ policenumber }}
  </a>
</footer>
</template>

<script setup>
import {computed, ref} from 'vue';

const userName = ref(import.meta.env.VITE_APP_USER_NAME);
const icpNumber = ref(import.meta.env.VITE_APP_ICP_NUMBER);
const policenumber = ref(import.meta.env.VITE_APP_POLICE_NUMBER);
const policeDigits = computed(() => policenumber.value?.match(/\d+/g)?.join('') || '')
const currentYear = new Date().getFullYear()
</script>