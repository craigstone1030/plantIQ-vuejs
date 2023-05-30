<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();
</script>
<template>
  <footer v-show="globalStore.getCurrentUser.email" class="sticky-bottom">
    <div class="bg-nav text-center p-3 text-[#98A6BA] z-9999">
      2023 &copy; Plant-IQ by Ai-inside Private
    </div>
  </footer>
</template>
<style scoped>
.sticky-bottom {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
