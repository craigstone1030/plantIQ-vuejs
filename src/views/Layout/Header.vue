<script lang="ts" setup>
import logo from '@/assets/logo.svg';

import ICON_NAV_DASHBOARD from '@/assets/icon/nav/dashboard.vue';
import ICON_NAV_DATASOURCE from '@/assets/icon/nav/datasource.vue';
import ICON_NAV_PROCESS from '@/assets/icon/nav/process.vue';
import ICON_NAV_DETECTORS from '@/assets/icon/nav/detectors.vue';
import ICON_NAV_ALERTS from '@/assets/icon/nav/alerts.vue';

import ICON_FLAG_US from '@/assets/icon/flag/us.png';
import IMG_AVATAR from '@/assets/avatar.png';
import ICON_NAV_SETTING from '@/assets/icon/nav/setting.vue';
import ICON_NAV_BELL from '@/assets/icon/nav/bell.vue';
import NavItem from '@/components/nav/NavItem.vue';
import { useGlobalStore } from '@/stores/global';
import { useRouter } from 'vue-router/composables';
import { useDashboardStore } from '@/stores/dashboard';
import { useAlertStore } from '@/stores/alert';
import { useDSStore } from '@/stores/datasource';
import { useDetectorStore } from '@/stores/detector';
import { useProcessStore } from '@/stores/process';

const globalStore = useGlobalStore();
const router = useRouter();

const onLogout = () => {
  globalStore.logout();
  globalStore.$reset();
  useDashboardStore().$reset();
  useAlertStore().$reset();
  useDSStore().$reset();
  useDetectorStore().$reset();
  useProcessStore().$reset();
  router.push({ name: 'Login' });
};
</script>

<template>
  <header>
    <b-navbar
      v-show="globalStore.getCurrentUser.email"
      class="lg:!py-0"
      fixed="top"
      toggleable="lg"
      type="dark"
      variant="nav"
    >
      <b-navbar-brand href="#">
        <img :src="logo" alt="Vue logo" width="130" height="30" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto">
          <NavItem href="/dashboard" title="dashboard">
            <ICON_NAV_DASHBOARD />
          </NavItem>
          <NavItem href="/datasource" title="datasource">
            <ICON_NAV_DATASOURCE />
          </NavItem>
          <NavItem href="/process" title="process">
            <ICON_NAV_PROCESS />
          </NavItem>
          <NavItem href="/detector" title="detectors">
            <ICON_NAV_DETECTORS />
          </NavItem>
          <NavItem href="/alert" title="alerts">
            <ICON_NAV_ALERTS />
          </NavItem>
        </b-navbar-nav>
      </b-collapse>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="!hidden lg:!flex h-[70px] place-items-center">
        <!-- <b-nav-item-dropdown class="vertical-center" no-caret right>
          <template #button-content>
            <img :src="ICON_FLAG_US" alt="flag_us" width="25" />
          </template>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="vertical-center" no-caret right>
          <template #button-content>
            <ICON_NAV_SETTING />
          </template>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="vertical-center" no-caret right>
          <template #button-content>
            <ICON_NAV_BELL />
          </template>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <b-nav-item-dropdown
          v-show="globalStore.getCurrentUser.username"
          id="avatar"
          class="vertical-center"
          no-caret
          right
        >
          <template #button-content>
            <img
              :src="IMG_AVATAR"
              alt="avatar"
              class="d-inline-block"
              width="25px"
            />
            {{ globalStore.getCurrentUser.username }}
          </template>
          <b-dropdown-item href="#" @click="onLogout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>

<style lang="scss">
#avatar {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0 10px;

  .nav-link {
    color: #d9dae0;
  }
}
</style>
