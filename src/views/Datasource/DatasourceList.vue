<script lang="ts" setup>
import ICON_DATASOURCE from '@/assets/icon/db.vue';
import ICON_PLUS from '@/assets/icon/plus.vue';
import ICON_EDIT from '@/assets/icon/edit.vue';
import ICON_TRASH from '@/assets/icon/trash.vue';
import DatasourceItem from '@/components/DatasourceItem.vue';
import NewDatasourceModal from '@/views/Datasource/NewDatasourceModal.vue';
import {Status} from '@/model/status';
import {useStore} from '@logue/vue2-helpers/vuex';
import {computed, onMounted} from 'vue';
import {API_GET_DATASOURCE} from '@/store/action';

const store = useStore();
onMounted(() => {
  store.commit(API_GET_DATASOURCE);
});

const datasourceList = computed(() => store.getters.datasourceList);
</script>

<template>
  <b-card>
    <template #header>
      <div class="d-flex justify-between">
        <div class="card-head d-inline-flex place-items-center">
          <ICON_DATASOURCE class="mr-1" />
          Data sources ({{ datasourceList.length }})
        </div>
        <div class="d-inline-flex place-items-center">
          <ICON_PLUS v-b-tooltip="'Add'" class="mx-1" v-b-modal="'new-datasource-modal'" />
          <NewDatasourceModal />
          <ICON_EDIT v-b-tooltip="'edit'" class="mx-1" />
          <ICON_TRASH v-b-tooltip="'trash'" class="mx-1" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="max-h-[1000px] px-1 overflow-y-auto">
        <DatasourceItem
          v-for="(db, index) in datasourceList"
          :key="index"
          :id="db.pk"
          :name="db.fields.name"
          :status="Status.ACTIVATED"
          :url="db.fields.url"
          class="mb-2"
        />
      </div>
    </template>
  </b-card>
</template>
