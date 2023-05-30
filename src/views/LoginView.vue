<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '@/stores/global';
import { useRouter } from 'vue-router/composables';
import { appHttp } from '@/axios';
import logo from '@/assets/logo_black.svg';

const globalStore = useGlobalStore();
const router = useRouter();

const show = ref(true);
const form = ref({
  email: '',
  password: '',
});

const onSubmit = async (event: Event) => {
  event.preventDefault();

  await globalStore.authLogin(form.value.email, form.value.password);
  appHttp.defaults.headers.common.Authorization = globalStore.token;
  router.push({ name: 'Dashboard' });
};
</script>

<template>
  <b-row class="justify-center py-10">
    <b-form
      v-if="show"
      class="bg-white py-3 px-5 shadow-md rounded-md"
      @submit="onSubmit"
    >
      <div class="text-center">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img :src="logo" alt="Vue logo" width="170" height="70" class="my-4" />
          <h2
            class="mb-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Sign in to your account
          </h2>
        </div>
      </div>

      <b-form-group
        id="input-group-2"
        label="Email address:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        />
      </b-form-group>

      <b-form-group id="input-group-3" label="Password:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        />
      </b-form-group>

      <b-button class="w-full" type="submit" variant="primary">
        Sign In
      </b-button>

      <div class="text-center mt-3">
        <p>
          Not a member?
          <router-link to="/signup" class="text-blue-600">Sign up</router-link>
        </p>
      </div>
    </b-form>
  </b-row>
</template>
