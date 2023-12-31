<script setup lang="ts">
import ICON_DETECTOR from '@/assets/icon/nav/detectors.vue';
import { Status } from '@/model/status';
import Vue, { onUpdated, ref } from 'vue';
import { useDetectorStore } from '@/stores/detector';

const props = defineProps({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Number, required: true },
  static: { type: Boolean, default: true },
});

const status = ref(false);

const store = useDetectorStore();

const emit = defineEmits(['click']);

onUpdated(() => {
  status.value = props.status === 1;
});

const loadMetrics = () => {
  emit('click', props.id);
};

const onChange = async () => {
  await store.updateStatus(props.id, !status.value);
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
      @click="loadMetrics"
    >
      <ICON_DETECTOR v-b-tooltip="description" class="icon-item" />
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
