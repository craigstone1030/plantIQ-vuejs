<script lang="ts" setup>
import { ref, watch } from 'vue';
import { API } from '@/api';
import { useSocketStore } from '@/stores/socket';
import { useGlobalStore } from '@/stores/global';

const props = defineProps<{
  detectorId: number;
}>();

const seriesData = ref<any[]>([]);
const rawChartData = ref<any[]>([]);
const loading = ref(true);
const socketStore = useSocketStore();
const globalStore = useGlobalStore();

const chartOptions = ref({
  xAxis: {
    type: 'datetime',
    visible: false,
  },
  yAxis: {
    visible: false,
  },
  title: {
    text: '',
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    pointFormat: '<b>{point.y}</b>',
    valueDecimals: 2,
    split: false,
  },
  series: seriesData,
  credits: {
    enabled: false,
  },
  navigator: {
    enabled: false,
  },
  rangeSelector: {
    selected: 1,
    enabled: false,
  },
  scrollbar: {
    enabled: false,
  },
  chart: {
    height: 70,
  },
});

const drawChart = (chartData: any[]) => {
  const jsonData = chartData;

  const series: any = {};
  for (let i = 0; i < jsonData.length; i++) {
    if (series[jsonData[i][0]] === undefined) {
      series[jsonData[i][0]] = [];
    }
    series[jsonData[i][0]].push([
      new Date(jsonData[i][1]).getTime() - new Date().getTimezoneOffset() * 60000,
      jsonData[i][2],
    ]);
  }

  seriesData.value.splice(0);
  Object.keys(series).forEach(name => {
    seriesData.value.push({
      name,
      data: series[name],
    });
    return null;
  });

  loading.value = false;
};

watch(
  () => props.detectorId,
  async val => {
    if (val === -1) return;
    globalStore.disableLock();
    loading.value = true;
    const res = await API.detector.loadTrendGraphByDetectorId(
      val
    );
    globalStore.enableLock();
    rawChartData.value = res.data;
    drawChart(res.data);
  }
);

watch(
  () => socketStore.currentMessage,
  async val => {
    if (val.type === 'DETECTOR_UPDATED') {
      if (val.detectorId === props.detectorId) {
        globalStore.disableLock();
        const res = await API.detector.loadGraphDataByDetectorIdAndBetweenDates(
          props.detectorId,
          new Date(val.startAt),
          new Date(val.stopAt)
        );
        globalStore.enableLock();
        const newData = JSON.parse(res.data.records);
        rawChartData.value = rawChartData.value
          .slice(newData.length)
          .concat(newData);
        drawChart(rawChartData.value);
      }
    }
  }
);
</script>

<template>
  <b-overlay :show="loading">
    <div v-if="rawChartData.length === 0">No data</div>
    <highcharts :constructor-type="'stockChart'" :options="chartOptions" />
  </b-overlay>
</template>
