<script setup lang="ts">
import Vue, { ref } from 'vue';
import { useGlobalStore } from '@/stores/global';
import { useRouter } from 'vue-router/composables';
import logo from '@/assets/logo_black.svg';

const globalStore = useGlobalStore();
const router = useRouter();

const show = ref(true);
const form = ref({
  email: '',
  name: '',
  password: '',
});

const onSubmit = async (event: Event) => {
  event.preventDefault();

  await globalStore.authSignup(
    form.value.name,
    form.value.email,
    form.value.password
  );
  Vue.notify({
    type: 'info',
    text: 'Signup succeed',
  });
  router.push({ path: '/login' });
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
            Sign up to your account
          </h2>
        </div>
      </div>

      <b-form-group id="input-group-1" label="Your name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          required
        />
      </b-form-group>

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
        Sign Up
      </b-button>

      <div class="text-center mt-3">
        <p>
          Have an account?
          <router-link to="/login" class="text-blue-600">Login</router-link>
        </p>
      </div>
    </b-form>
  </b-row>
</template>
