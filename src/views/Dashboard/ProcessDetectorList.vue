<script setup lang="ts">
import Process from '@/components/Dashboard/Process.vue';
import { Status } from '@/model/status';
import { useDashboardStore } from '@/stores/dashboard';
import { onMounted, watch } from 'vue';
import { useProcessStore } from '@/stores/process';

const store = useDashboardStore();
const processStore = useProcessStore();

watch(
  () => store.getSelectedProcessId,
  async val => {
    if (val !== -1) {
      await store.loadMonitorsByProcessId();
    }
  }
);

const onSelectMonitor = (id: number) => {
  store.setCurrentDetectorId(id);
};
</script>

<template>
  <b-card>
    <p class="card-head">
      Process
      <span v-if="store.getSelectedProcessId !== -1">
        -
        {{
          processStore.getProcessList.find(
            i => i.pk === store.getSelectedProcessId
          ).fields.name
        }}
      </span>
    </p>

    <span v-if="store.getSelectedProcessId === -1">
      Click process to show monitors
    </span>
    <span v-else-if="store.getMonitors.length === 0">No monitors ...</span>

    <Process
      v-for="(process, index) in store.getMonitors"
      :id="process.detectorId"
      :key="index"
      :active="store.getSelectedDetectorId === process.detectorId"
      :actual-score="process.actualScore"
      :date="process.lastUpdatedAt"
      :max-anomaly="process.maxAnomaly"
      :status="process.status"
      :top-alerts="process.totalAlerts"
      @click="onSelectMonitor"
    />
  </b-card>
</template>
