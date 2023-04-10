<script setup lang="ts">
import Header from '@/views/Layout/Header.vue';
import Footer from '@/views/Layout/Footer.vue';
import {useStore} from '@logue/vue2-helpers/vuex';

document.title = import.meta.env.VITE_APP_TITLE || 'Plant IQ';

const store = useStore();
</script>

<template>
  <div>
    <b-overlay :show="store.state.overlay" rounded="sm">
      <Header />

      <main>
        <router-view />
      </main>

      <Footer />
    </b-overlay>
  </div>
</template>
