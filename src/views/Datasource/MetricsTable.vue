<script lang="ts" setup>
import ICON_METRICS from '@/assets/icon/metrics.vue';
import { ref, watch } from 'vue';
import { useStore } from '@logue/vue2-helpers/vuex';

const store = useStore();

watch(
  () => store.state.metricsList,
  (val, oldVal) => {
    if (val.length > 0) {
      store.state.metric = val[0];

      store.dispatch('loadChartDataByMetricAndBetweenDates');
    } else {
      store.state.metric = '';
    }
  }
);
watch(
  () => store.state.metric,
  (val, oldVal) => {
    store.dispatch('loadChartDataByMetricAndBetweenDates');
  }
);
</script>

<template>
  <b-card class="min-h-[300px]">
    <template #header>
      <div class="d-flex justify-between">
        <div class="card-head d-inline-flex place-items-center">
          <ICON_METRICS class="mr-1" />
          Metrics (27)
        </div>
      </div>
    </template>
    <template #default>
      <div class="px-1 overflow-x-auto">
        <div class="grid grid-rows-6 grid-flow-col gap-4 pb-3">
<!--        <div>-->
          <b-form-radio-group
            v-model="store.state.metric"
            name="flavour-4a"
          >
            <b-form-radio
              class="w-[150px]"
              v-for="(option, index) in $store.getters.metricsList"
              :key="index"
              :value="option"
            >
              {{ option }}
            </b-form-radio>
          </b-form-radio-group>
        </div>
      </div>
    </template>
  </b-card>
</template>
