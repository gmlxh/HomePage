<template>
  <div class="content">
    <div class="user-profile-container">
      <div class="user-profile-image" v-motion-pop>
        <img :src="profileImage" alt="头像" @click.stop="toggleInfo">
        <span class="status-ball"></span>
      </div>
      <div class="user-name" v-motion-slide-left>
        <h1>Hi,</h1>
        <h1>I'm <span class="name-style">{{ userName }}</span></h1>
      </div>
    </div>
    <div class="description">
      <p ref="descriptionElement"></p>
    </div>
    <div class="contact-section" v-motion-pop>
      <template v-for="contact in contacts" :key="contact.type">
        <a v-if="contact.url" :href="contact.url" target="_blank" class="contact-item" :style="{ '--hover-color': contact.hoverColor }">
          <i :class="contact.icon"></i>
          <span class="tooltip">{{ contact.type }}</span>
        </a>
        <span v-else @click="toggleQRCode(contact.qrCode)" class="contact-item" :style="{ '--hover-color': contact.hoverColor }">
          <i :class="contact.icon"></i>
          <span class="tooltip">{{ contact.type }}</span>
        </span>
      </template>

      <div class="theme-dropdown-container">
        <span class="contact-item theme-toggler"
              @click.stop="toggleDropdown"
              :style="{ '--hover-color': themeHoverColor(currentTheme) }">
          <i :class="themeIconClass(currentTheme)"></i>
          <span class="tooltip">{{ themeName(currentTheme) }}</span>
        </span>

        <Transition name="fade-down">
          <div v-if="showDropdown" class="theme-dropdown" @mouseleave="hideDropdown">
            <div class="dropdown-item"
                 :class="{ 'active': currentTheme === THEME_SYSTEM }"
                 @click="selectTheme(THEME_SYSTEM)">
              <i :class="themeIconClass(THEME_SYSTEM)"></i>
              <span>{{ themeName(THEME_SYSTEM) }}</span>
            </div>
            <div class="dropdown-item"
                 :class="{ 'active': currentTheme === THEME_LIGHT }"
                 @click="selectTheme(THEME_LIGHT)">
              <i :class="themeIconClass(THEME_LIGHT)"></i>
              <span>{{ themeName(THEME_LIGHT) }}</span>
            </div>
            <div class="dropdown-item"
                 :class="{ 'active': currentTheme === THEME_DARK }"
                 @click="selectTheme(THEME_DARK)">
              <i :class="themeIconClass(THEME_DARK)"></i>
              <span>{{ themeName(THEME_DARK) }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
    <Website />
    <VisitTimer />
    <WelcomeBubble />

    <Transition name="fade">
      <div v-if="showAbout" class="overlay" @click="showAbout = false">
        <div class="modal-content">
          <AboutPage @close="showAbout = false" />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showQR" class="overlay" @click="hideQRCode">
        <div class="modal-content">
          <img :src="qrCodeSrc" alt="QR Code" class="qr-image" @click.stop>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import contactsData from '../config/links.json';
import Website from './Website.vue';
import AboutPage from './AboutPage.vue';
import VisitTimer from './VisitTimer.vue';
import WelcomeBubble from './WelcomeBubble.vue';
import Typed from 'typed.js';

const contacts = ref(contactsData);
const showQR = ref(false);
const showAbout = ref(false);
const qrCodeSrc = ref('');
const profileImage = ref(import.meta.env.VITE_APP_PROFILE_IMAGE_URL);
const userName = ref(import.meta.env.VITE_APP_USER_NAME);
const descriptionElement = ref(null);
const showDropdown = ref(false);

const predefinedDescriptions = [
  "这个世界变得如此陌生，连同我自己的存在。",
  "The world has grown so strange that even my own existence feels like a stranger to me."
];

let typedInstance = null;

const initializeTyped = () => {
  typedInstance = new Typed(descriptionElement.value, {
    strings: predefinedDescriptions,
    typeSpeed: 120,
    backSpeed: 80,
    showCursor: true,
    cursorChar: '|',
    loop: true,
  });
};

const toggleQRCode = (qrCode) => {
  qrCodeSrc.value = qrCode || '';
  showQR.value = !showQR.value;
};

const hideQRCode = () => {
  showQR.value = false;
};

const toggleInfo = () => {
  showAbout.value = !showAbout.value;
};

const THEME_SYSTEM = 'system';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

const currentTheme = ref(null);
const isDarkModeActive = ref(false);
let mediaQuery = null;
let mediaQueryListener = null;

const applyTheme = (theme) => {
  let isDark = false;

  if (theme === THEME_DARK) {
    isDark = true;
  } else if (theme === THEME_SYSTEM) {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  document.body.classList.toggle('dark-mode', isDark);
  isDarkModeActive.value = isDark;
};

const toggleTheme = (theme) => {
  if (theme === currentTheme.value) {
    return;
  }

  currentTheme.value = theme;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const hideDropdown = () => {
  showDropdown.value = false;
};

const selectTheme = (theme) => {
  toggleTheme(theme);
  hideDropdown();
};

const themeIconClass = (theme) => {
  if (theme === THEME_LIGHT) return 'fas fa-sun';
  if (theme === THEME_DARK) return 'fas fa-moon';
  return 'fas fa-desktop';
};

const themeName = (theme) => {
  if (theme === THEME_LIGHT) return '浅色';
  if (theme === THEME_DARK) return '深色';
  return '系统';
};

const themeHoverColor = (theme) => {
  if (theme === THEME_LIGHT) return '#ffcc00';
  if (theme === THEME_DARK) return '#666';
  return '#1e90ff';
}


onMounted(() => {
  initializeTyped();

  document.addEventListener('click', hideDropdown);

  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || THEME_SYSTEM;
  currentTheme.value = initialTheme;
  applyTheme(initialTheme);

  if (window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQueryListener = (event) => {
      if (currentTheme.value === THEME_SYSTEM) {
        document.body.classList.toggle('dark-mode', event.matches);
        isDarkModeActive.value = event.matches;
      }
    };

    mediaQuery.addEventListener('change', mediaQueryListener);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', hideDropdown);
  if (mediaQuery && mediaQueryListener) {
    mediaQuery.removeEventListener('change', mediaQueryListener);
  }
});
</script>

<style scoped>
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;

  .user-profile-container {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .user-profile-image {
    display: flex;
    border-radius: 50%;
    box-shadow: 0 2px 8px var(--shadow-color);
    padding: 5px;
    border: 3px solid var(--border-color);
    position: relative;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;

      &:hover {
        cursor: pointer;
      }
    }

    .status-ball {
      position: absolute;
      background: #00c800;
      width: 2em;
      height: 2em;
      border-radius: 20px;
      border: 3px solid #eee;
      bottom: 5px;
      right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      z-index: 1;
      cursor: pointer;
      overflow: hidden;

      &::before {
        content: "在线中";
        color: #00c800;
        opacity: 0;
        transition: opacity 0.3s ease-in-out, color 0.1s ease-in-out;
      }

      &:hover {
        width: 4.5em;
        height: 2em;
      }

      &:hover::before {
        opacity: 1;
        color: #eee;
      }
    }
  }

  .user-name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.3em;

    h1 {
      margin: 0;
    }
  }

  .name-style {
    position: relative;

    &:before {
      position: absolute;
      border-radius: 5px;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);
      z-index: -1;
      content: "";
      background: #ffcc00ad;
      height: 30%;
      width: 110%;
      transition: height 0.3s ease-in-out;
    }
    &:hover::before {
      height: 60%;
    }
  }

  .description {
    display: flex;
    min-height: 32px;
    width: 100%;
    max-width: 500px;
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;

    &::before,
    &::after {
      content: '"';
      font-size: 1.5em;
      color: #999;
      margin: 0 10px;
    }

    p {
      margin: 0;
    }
  }

  .contact-section {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 5px 10px;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    transition: all 0.3s ease-in-out;
    position: relative;
    z-index: 1000;

    .theme-dropdown-container {
      position: relative;
      display: flex;
    }

    .contact-item {
      color: var(--text-color);
      font-size: var(--icon-size);
      cursor: pointer;
      transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
      position: relative;

      .fas.fa-moon {
        width: 20px;
        height: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

      &:hover {
        transform: translateY(-5px) rotate(10deg);
        color: var(--hover-color);

        .tooltip {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, 10px);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        white-space: nowrap;
        pointer-events: none;
      }
    }

    &:hover {
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 8px var(--shadow-color);
      background-color: rgba(var(--background-color-rgb), 0.2);
    }

    .theme-dropdown {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 10px;
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px var(--shadow-color);
      z-index: 1001;
      padding: 5px;
      min-width: 100px;
      pointer-events: auto;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.2s ease, color 0.2s ease;
      font-size: 14px;
      white-space: nowrap;

      &:hover {
        background-color: var(--hover-color-light);
        color: var(--primary-color);
      }

      &.active {
        font-weight: bold;
        color: var(--primary-color);
        background-color: rgba(var(--primary-color-rgb), 0.1);
      }
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  /* 下拉菜单动画 */
  .fade-down-enter-active,
  .fade-down-leave-active {
    transition: all 0.2s ease-out;
  }

  .fade-down-enter-from,
  .fade-down-leave-to {
    opacity: 0;
    transform: translate(-50%, -10px);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease-out;

    .modal-content {
      transition: all 0.3s ease-out;
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;

    .modal-content {
      transform: translateY(30px) scale(0.8);
      opacity: 0;
    }
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;

    .modal-content {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  .qr-image {
    width: 300px;
    height: 300px;
    background: white;
    padding: 20px;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 8px var(--shadow-color);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    &:hover {
      transform: scale(1.03) translateY(-5px);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
    }
  }
}

@media screen and (max-width: 768px) {
  .content {
    gap: 15px;
  }
  .content .user-profile-container {
    flex-direction: column;
    gap: 0;
  }

  h1 {
    font-size: 1.5em;
  }
}
</style>