<script setup lang="ts">
import { API } from '@/api';
import ICON_ALERT from '@/assets/icon/nav/alerts.vue';
import { Status } from '@/model/status';
import { store } from '@/stores';
import { useAlertStore } from '@/stores/alert';
import Vue, { onUpdated, ref } from 'vue';

const props = defineProps({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Number, required: true },
  static: { type: Boolean, default: true },
});

const store = useAlertStore();

const status = ref(false);

const emit = defineEmits(['click']);

onUpdated(() => {
  status.value = props.status === 1;
});

const loadHistory = () => {
  emit('click', props.id);
};

const onChange = async () => {
  await store.updateStatus(props.id, status.value ? 0 : 1)
  status.value = !status.value;
  Vue.notify({
    text: 'Status changed',
  });
};
</script>
<template>
  <div
    class="flex gap-1 px-1 my-2 align-items-center cursor-pointer rounded-md transition-all hover:bg-[#E5E7EB]"
  >
    <a
      class="flex flex-1 gap-1 py-1 align-items-center cursor-pointer"
      href="#"
      @click="loadHistory"
    >
      <ICON_ALERT v-b-tooltip="description" class="icon-item" />
      <div>{{ name }}</div>
    </a>

    <b-checkbox v-if="!static" v-model="status" switch @change="onChange" />
    <span
      v-else
      class="rounded-pill text-xs"
      :class="{
        success: status,
        danger: !status,
      }"
    >
      {{ status ? Status.ACTIVATED : Status.DISABLED }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.success {
  padding: 0.1rem 0.6rem;
  background-color: #21965310;
  color: #219653;
  font-family: 'Inter', serif;
}
.danger {
  padding: 0.1rem 0.6rem;
  background-color: #d3405310;
  color: #d34053;
  font-family: 'Inter', serif;
}
</style>
