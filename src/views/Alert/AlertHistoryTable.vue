<script setup lang="ts">
import ICON_DETECTOR from '@/assets/icon/nav/detectors.vue';
import ICON_SUCCESS from '@/assets/icon/status/success.svg';
import ICON_WARNING from '@/assets/icon/status/warning.svg';
import ICON_ERROR from '@/assets/icon/status/error.svg';
import { useAlertStore } from '@/stores/alert';
import type { BvTableFieldArray } from 'bootstrap-vue/src/components/table';
import { ref } from 'vue';

const store = useAlertStore();

const fields: BvTableFieldArray = [
  {
    key: 'alertType',
    label: '',
    sortable: false,
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'anomalyValue',
    label: 'Anomaly Level',
    sortable: true,
  },
  {
    key: 'detectorName',
    label: 'Process/Detector',
    sortable: true,
  },
  {
    key: 'alertAt',
    label: 'Last alert',
    sortable: false,
  },
];

const currentPage = ref(0);
</script>

<template>
  <div>
    <b-card class="h-100">
      <template #header>
        <div class="d-flex justify-between">
          <div class="card-head d-inline-flex place-items-center">
            <ICON_DETECTOR class="mr-1" variant="dark" />
            Alert History ({{ store.getHistory.length }})
          </div>
        </div>
      </template>
      <template #default>
        <span v-if="store.getHistory.length === 0">No alert histories...</span>
        <div v-else class="text-center">
          <b-table
            borderless
            hover
            :items="store.getHistory"
            :fields="fields"
            per-page="10"
            :current-page="currentPage"
          >
            <template #cell(alertType)="data">
              <img
                v-if="data.value == 1"
                :src="ICON_WARNING"
                alt=""
                width="15"
              />
              <img
                v-else-if="data.value == 2"
                :src="ICON_ERROR"
                alt=""
                width="15"
              />
              <img v-else :src="ICON_SUCCESS" alt="" width="15" />
            </template>

            <template #cell(name)="data">
              {{ data.value }}
            </template>

            <template #cell(anomalyValue)="data">
              {{ data.value | number }}
            </template>

            <template #cell(detectorName)="data">
              {{ data.value }}
            </template>

            <template #cell(alertAt)="data">
              {{ new Date(data.value).toLocaleString() | date_format }}
              {{ new Date(data.value).toLocaleString() | time_format }}
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            class="justify-center"
            :total-rows="store.getHistory.length"
            :per-page="10"
          />
        </div>
      </template>
    </b-card>
  </div>
</template>

<style lang="scss">
thead {
  background-color: #eff4fb;
}
</style>
