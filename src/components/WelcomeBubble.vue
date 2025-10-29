<template>
  <Transition name="welcome-bubble-fade">
    <div v-if="isVisible" class="welcome-bubble-container">
      <button @click="closeBubble" class="bubble-close-btn">
        <i class="fas fa-times"></i>
      </button>

      <div class="bubble-header">
        <i class="fas fa-hand-sparkles"></i>
        <span id="location">{{ location }}</span>
      </div>

      <div class="bubble-content">
        <div id="os" class="data-item" v-if="os">
          <i :class="osIcon"></i>
          <span></span>
          <span class="data-text">{{ os }}</span>
        </div>
        <div id="browser" class="data-item">
          <i class="fab fa-safari"></i>
          <span></span>
          <span class="data-text">{{ browser }}</span>
        </div>
        <div id="ip" class="data-item" v-if="ip" @click="toggleIpVisibility">
          <i class="fas fa-globe"></i>
          <span></span>
          <span class="data-text" :class="{ 'spoiler': ipHidden }">{{ ip }}</span>
        </div>
        <div id="isp" class="data-item" v-if="isp" @click="toggleIspVisibility">
          <i class="fas fa-server"></i>
          <span></span>
          <span class="data-text" :class="{ 'spoiler': ispHidden }">{{ isp }}</span>
        </div>
        <div id="date" class="data-item">
          <i class="fas fa-calendar-alt"></i>
          <span></span>
          <span class="data-text">{{ date }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const isVisible = ref(false);
const location = ref("欢迎你，朋友！");
const ip = ref('');
const isp = ref('');
const browser = ref('');
const date = ref('');
const os = ref('');
const ipHidden = ref(false);
const ispHidden = ref(false);

const toggleIpVisibility = () => {
  ipHidden.value = !ipHidden.value;
};

const toggleIspVisibility = () => {
  ispHidden.value = !ispHidden.value;
};

const osIcon = computed(() => {
  const system = os.value.toLowerCase();
  if (system.includes('windows')) return 'fab fa-windows';
  if (system.includes('mac')) return 'fab fa-apple';
  if (system.includes('linux')) return 'fab fa-linux';
  if (system.includes('android')) return 'fab fa-android';
  if (system.includes('ios')) return 'fab fa-app-store-ios';
  return 'fas fa-desktop';
});


const closeBubble = () => {
  isVisible.value = false;
};

const getOperatingSystem = (userAgent) => {
  if (/android/i.test(userAgent)) return "Android";
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
  if (/macintosh|mac os x/i.test(userAgent)) return "macOS";
  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/linux/i.test(userAgent)) return "Linux";
  return "未知设备";
};

onMounted(async () => {
  if (window.ipInfoFetched) return;
  window.ipInfoFetched = true;

  os.value = getOperatingSystem(navigator.userAgent);

  browser.value = ((ua) => {
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "未知";
  })(navigator.userAgent) + ' 浏览器';

  date.value = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai'
  });

  const ipApis = ['https://api.ip.sb/geoip/', 'https://ip-api.io/json'];
  let fetchedData = {};

  for (const api of ipApis) {
    try {
      const response = await fetch(api, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        const data = await response.json();
        if (api.includes('ip-api.io')) {
          fetchedData = { city: data.city, region: data.regionName, country: data.countryName, isp: data.organisation, ip: data.ip };
        } else if (api.includes('api.ip.sb')) {
          fetchedData = { city: data.city, region: data.region, country: data.country, isp: data.asn_organization, ip: data.ip };
        }
        if (fetchedData.ip) break;
      }
    } catch (e) { console.warn(`Failed to fetch from ${api}:`, e); }
  }

  if (fetchedData.ip) ip.value = fetchedData.ip;
  if (fetchedData.isp) isp.value = fetchedData.isp;

  if (fetchedData.city && fetchedData.region) {
    location.value = `欢迎来自 ${fetchedData.region}, ${fetchedData.city} 的朋友！`;
  } else if (fetchedData.country) {
    location.value = `欢迎来自 ${fetchedData.country} 的朋友！`;
  }

  setTimeout(() => { isVisible.value = true; }, 300);
});
</script>

<style scoped lang="less">
.welcome-bubble-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  padding: 15px 20px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  background-color: rgba(var(--background-color-rgb), 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px var(--shadow-color);
  font-size: 14px;
  width: auto;
  max-width: calc(100vw - 40px);
}

.bubble-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
    color: #c61b09;
  }
}

.bubble-header {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bubble-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  i {
    width: 18px;
    text-align: center;
  }

  .data-text {
    font-weight: bold;
    color: var(--primary-color);
  }
}

.spoiler {
  background: var(--primary-color);
  color: transparent !important;
  user-select: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 6px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.welcome-bubble-fade {
  &-enter-active, &-leave-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  &-enter-from, &-leave-to { opacity: 0; transform: translateX(-20px) translateY(-20px) scale(0.8); }
}

/* 调整在移动端的显示样式 */
@media (max-width: 768px) {
  .welcome-bubble-container {
    top: 10px;
    left: 10px;
    padding: 10px 15px;
    font-size: 12px;
    max-width: calc(100vw - 20px);
  }
}
</style>