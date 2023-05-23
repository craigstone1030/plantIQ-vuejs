<script lang="ts" setup>
import VueSlickCarousel from 'vue-slick-carousel';
import ProcessTab from '@/components/Dashboard/ProcessTab.vue';
import { onMounted } from 'vue';

import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
import { useProcessStore } from '@/stores/process';
import { useDashboardStore } from '@/stores/dashboard';

const processStore = useProcessStore();
const store = useDashboardStore();

const slickSetting = {
  arrows: false,
  dots: true,
  focusOnSelect: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const onSelectTab = (id: number) => {
  store.setCurrentProcessId(id);
};

onMounted(async () => {
  await processStore.loadProcessList(false);
  if (processStore.getProcessList.length)
    store.setCurrentProcessId(processStore.processList[0].pk);
});
</script>

<template>
  <div :class="{ 'flex h-full': processStore.getProcessList.length === 0 }">
    <VueSlickCarousel
      v-if="processStore.getProcessList.length"
      v-bind="slickSetting"
      class="mb-5"
    >
      <ProcessTab
        v-for="(pTab, index) in processStore.getProcessList"
        :key="index"
        :active="store.getSelectedProcessId === pTab.pk"
        v-bind="pTab"
        @click="onSelectTab"
      />
    </VueSlickCarousel>
    <b-card v-else class="w-100 none">No process ...</b-card>
    <!--    <b-pagination-nav-->
    <!--      v-model="currentPage"-->
    <!--      :number-of-pages="pages"-->
    <!--      class="mb-0"-->
    <!--      align="center"-->
    <!--      base-url="#"-->
    <!--      first-number-->
    <!--      last-number-->
    <!--      next-text=">"-->
    <!--      pills-->
    <!--      prev-text="<"-->
    <!--    />-->
  </div>
</template>
<style scoped>
.none .card-body {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
