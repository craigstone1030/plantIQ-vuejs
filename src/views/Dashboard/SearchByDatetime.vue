<script setup lang="ts">
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { useDashboardStore } from '@/stores/dashboard';
import { useGlobalStore } from '@/stores/global';

const store = useDashboardStore();

const globalStore = useGlobalStore();

const onClick = () => {
  store.loadChartDataByDetectorId();
};
</script>

<template>
  <b-card class="px-2">
    <b-form>
      <b-input-group class="mb-2 justify-center">
        <b-input-group-prepend class="w-[4rem]">
          <b-input-group-text class="w-100 justify-content-center">
            START
          </b-input-group-text>
        </b-input-group-prepend>
        <date-picker v-model="globalStore.startDt" placeholder="" type="datetime" />
      </b-input-group>

      <b-input-group class="mb-2 justify-center">
        <b-input-group-prepend class="w-[4rem]">
          <b-input-group-text class="w-100 justify-content-center">
            END
          </b-input-group-text>
        </b-input-group-prepend>
        <date-picker v-model="globalStore.endDt" placeholder="" type="datetime" />
      </b-input-group>

      <div class="mt-3 text-center">
        <b-button
          class="w-[70px] mx-1 tracking-widest"
          type="button"
          variant="primary"
          :disabled="store.getSelectedDetectorId === -1"
          @click="onClick"
        >
          OK
        </b-button>
      </div>
    </b-form>
  </b-card>
</template>

<style lang="scss">
.mx-datepicker {
  width: auto;
}
</style>
