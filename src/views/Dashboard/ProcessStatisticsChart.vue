<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useProcessStore } from '@/stores/process';
import { useSocketStore } from '@/stores/socket';

const store = useDashboardStore();
const processStore = useProcessStore();
const socketStore = useSocketStore();

const seriesData = ref<any[]>([]);
const plotLines = ref<any[]>([]);

const lock = ref(true);

const chartOptions = ref({
  rangeSelector: {
    selector: 1,
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    plotLines,
  },
  title: {
    text: '',
  },
  legend: {
    enabled: true,
  },
  tooltip: {
    pointFormat:
      '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
    valueDecimals: 2,
    split: true,
  },
  series: seriesData,
  credits: {
    enabled: false,
  },
});

watch(
  () => store.getSelectedDetectorId,
  async val => {
    lock.value = true;
    console.log(val);
    if (store.getSelectedDetectorId !== -1)
      await store.loadChartDataByDetectorId();
    lock.value = false;
  }
);

watch(
  () => store.chartData,
  val => {
    const jsonData = val.records;

    /* START Chart Bar---------------------------------------------------- */
    const series: any = {};
    for (let i = 0; i < jsonData.length; i++) {
      if (series[jsonData[i][0]] === undefined) {
        series[jsonData[i][0]] = [];
      }
      series[jsonData[i][0]].push([new Date(jsonData[i][1]).getTime() - new Date().getTimezoneOffset() * 60000, jsonData[i][2]]);
    }

    seriesData.value.splice(0);
    Object.keys(series).forEach(name => {
      seriesData.value.push({
        name,
        data: series[name],
        type: 'spline',
      });
      return null;
    });
    /* END Chart Bar */

    /*  START Alert--------------------------------------------------  */
    const histories = val.histories;
    const alertJson = {
      treshold1: {
        type: 'flags',
        name: 'NearCriticalTreshold',
        color: 'blue',
        accessibility: {
          exposeAsGroupOnly: true,
          description: 'Flagged events.',
        },
        data: [],
        onSeries: 'dataseries',
        shape: 'circlepin',
        width: 16,
        fillColor: 'blue',
        style: {
          color: 'white',
        },
      },
      treshold2: {
        type: 'flags',
        name: 'CriticalTreshold',
        color: 'red',
        accessibility: {
          exposeAsGroupOnly: true,
          description: 'Flagged events.',
        },
        data: [],
        onSeries: 'dataseries',
        shape: 'circlepin',
        width: 16,
        fillColor: 'red',
        style: {
          color: 'white',
        },
      },
      treshold3: {
        type: 'flags',
        name: 'Normal',
        color: 'green',
        accessibility: {
          exposeAsGroupOnly: true,
          description: 'Flagged events.',
        },
        data: [],
        onSeries: 'dataseries',
        shape: 'circlepin',
        width: 16,
        fillColor: 'green',
        style: {
          color: 'white',
        },
      },
    };
    for (let i = 0; i < histories.length; i++) {
      if (histories[i].alertType === 1) {
        alertJson.treshold1.data.push({
          x: new Date(histories[i].alertAt),
          y: histories[i].anomalyValue,
          title: 'A',
        } as never);
      } else if (histories[i].alertType === 2) {
        alertJson.treshold2.data.push({
          x: new Date(histories[i].alertAt),
          y: histories[i].anomalyValue,
          title: 'C',
        } as never);
      } else if (histories[i].alertType === 3) {
        alertJson.treshold3.data.push({
          x: new Date(histories[i].alertAt),
          y: histories[i].anomalyValue,
          title: 'N',
        } as never);
      }
    }
    seriesData.value.push(alertJson.treshold1);
    seriesData.value.push(alertJson.treshold2);
    seriesData.value.push(alertJson.treshold3);

    /*  END Alert  */

    /* START High & Low Line--------------------------------------------------- */
    plotLines.value = [];

    try {
      const low = store.getChartData.alert.fields.nearCriticalTreshold;
      if (low !== null) {
        plotLines.value.push({
          value: low,
          color: 'green',
          dashStyle: 'shortdash',
          width: 2,
        });
      }
    } catch (e) {}

    try {
      const high = store.getChartData.alert.fields.criticalTreshold;
      if (high !== null) {
        plotLines.value.push({
          value: high,
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
        });
      }
    } catch (e) {}
    /* END High & Low Line */
  }
);

watch(
  () => socketStore.currentMessage,
  async val => {
    if (val.type === 'NEW_ALERTS' && lock.value === false) {
      if (store.getSelectedDetectorId === val.detectorId) {
        const alerts = JSON.parse(val.alerts);
        console.log(alerts);
        for (let i = 0; i < alerts.length; i++) {
          if (alerts[i].alertType === 1) {
            seriesData.value[seriesData.value.length - 3].data.push({
              x: new Date(alerts[i].alertAt),
              y: alerts[i].anomalyValue,
              title: 'A',
            });
          } else if (alerts[i].alertType === 2) {
            seriesData.value[seriesData.value.length - 2].data.push({
              x: new Date(alerts[i].alertAt),
              y: alerts[i].anomalyValue,
              title: 'C',
            });
          } else if (alerts[i].alertType === 3) {
            seriesData.value[seriesData.value.length - 1].data.push({
              x: new Date(alerts[i].alertAt),
              y: alerts[i].anomalyValue,
              title: 'N',
            });
          }
        }
      }
    }
  }
);
</script>

<template>
  <b-card>
    <p class="card-head">
      Anomaly Graph
      <span v-if="store.getSelectedDetectorId !== -1">
        -
        {{
          store.getMonitors.find(i => i.detectorId === store.getSelectedDetectorId).name
        }}
      </span>
    </p>

    <!-- <div
      v-if="
        store.getSelectedDetectorId !== -1 &&
        store.getChartData.records.length !== 0
      "
    > -->
      <highcharts :constructor-type="'stockChart'" :options="chartOptions" />
    <!-- </div> -->
    <!-- <span v-else>No data ...</span> -->
  </b-card>
</template>
