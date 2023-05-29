<script lang="ts" setup>
import { Status } from '@/model/status';
import { computed, onMounted, ref } from 'vue';
import { API } from '@/api';
import { useDashboardStore } from '@/stores/dashboard';
import TightChart from '@/components/Dashboard/TightChart.vue';
import { useGlobalStore } from '@/stores/global';
import { useProcessStore } from '@/stores/process';

import { Carousel, Slide } from 'vue-carousel';

const store = useDashboardStore();
const processStore = useProcessStore();
const globalStore = useGlobalStore();

const color = {
  [Status.ACTIVATED]: '#219653',
  [Status.PENDING]: '#FFA70B',
  [Status.DISABLED]: '#D34053',
};

const detectors = ref([]);

const props = defineProps<{
  pk: number;
  fields: any;
  active: boolean;
}>();

const selectedDetectorId = ref(-1);

const status = computed(() => {
  return props.fields.status ? Status.ACTIVATED : Status.DISABLED;
});

const emit = defineEmits(['click']);

const clickEvent = () => {
  emit('click', props.pk);
};

const onClickEvent = (detectorId: number) => {
  selectedDetectorId.value = detectorId;
};

const convertToStatus = (state: number) => {
  if (state) return Status.ACTIVATED;
  else return Status.DISABLED;
};

onMounted(async () => {
  globalStore.lockScreen();
  const res = await API.process.loadDetectorsByProcessId(props.pk);
  const resArray = JSON.parse(res.data);
  // if (
  //   processStore.getProcessList.length &&
  //   resArray.length &&
  //   processStore.getProcessList[0].pk === store.getSelectedProcessId
  // )
  //   store.setCurrentDetectorId(resArray[0].pk);
  globalStore.unlockScreen();
  detectors.value = resArray;
  if (res.data.length) {
    selectedDetectorId.value = detectors.value[0].pk;
  }
});
</script>
<template>
  <b-card
    class="max-w-[300px] px-2 cursor-pointer"
    :class="{
      '!border-2 !border-sky-600': active,
      '!border-2 !border-white': !active,
    }"
    @click="clickEvent"
  >
    <div class="d-flex justify-between">
      <a
        class="text-base font-weight-bold hover:cursor-pointer"
        :style="{ whiteSpace: 'nowrap' }"
        href="#"
      >
        {{ fields.name }}
      </a>
      <span
        :style="{
          backgroundColor: color[status] + '50',
          color: color[status],
        }"
        class="px-1 py-[0.1rem] rounded-lg"
      >
        {{ status }}
      </span>
    </div>

    <div class="py-3">
      <!--      <ICON_CURVE class="w-100 min-h-full" />-->
      <tight-chart :detector-id="selectedDetectorId" />
    </div>

    <!-- <div class="d-flex justify-center gap-[1rem]"> -->
    <div className="flex w-full">
      <carousel>
        <slide
          v-for="(detector, index) in detectors"
          :key="index"
          class="w-6/12"
        >
          <button
            v-b-tooltip.hover
            :title="detector.fields.name"
            :style="{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              width: '100%',
              backgroundColor:
                color[convertToStatus(detector.fields.status)] + '50',
              color: color[convertToStatus(detector.fields.status)],
              border:
                selectedDetectorId === detector.pk ? '1px solid red' : 'none',
            }"
            class="px-1 py-[0.1rem] rounded-lg"
            @click="onClickEvent(detector.pk)"
          >
            {{ detector.fields.name }}
          </button>
        </slide>
      </carousel>
    </div>
    <!-- </div> -->
  </b-card>
</template>
<style>
.VueCarousel-slide {
  padding: 0 5px;
}
.VueCarousel-dot-container {
  margin-top: 0 !important;
}
.VueCarousel-dot {
  margin-top: 0 !important;
}
</style>