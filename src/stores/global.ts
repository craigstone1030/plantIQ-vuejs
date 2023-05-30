import { defineStore } from 'pinia';
import { store } from '@/stores/index';
import { API } from '@/api';
import router from '@/router';
import jwtDecode from 'jwt-decode';

interface IUser {
  id: number;
  email: string;
  username: string;
}

interface GlobalState {
  overlay: boolean;
  disable: boolean;
  token: string;
  user: IUser;
  startDt: Date;
  endDt: Date;
}

let timeId = -1;

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    overlay: false,
    disable: false,
    token: '',
    user: {
      id: -1,
      email: '',
      username: '',
    },
    startDt: new Date(new Date().getTime() - 3600 * 12 * 1000),
    endDt: new Date(new Date().getTime()),
  }),
  getters: {
    getOverlay(state): boolean {
      return state.overlay;
    },
    getCurrentUser(state) {
      return state.user;
    },
  },
  actions: {
    lockScreen() {
      if (!this.disable) {
        if (timeId === -1) {
          this.overlay = true;
        } else {
          clearTimeout(timeId);
          timeId = window.setTimeout(() => {
            this.overlay = true;
          }, 200);
        }
      }
    },
    unlockScreen() {
      // if (!this.disable) {
      clearTimeout(timeId);
      timeId = window.setTimeout(() => {
        this.overlay = false;
        timeId = -1;
      }, 200);
      // }
    },
    disableLock() {
      this.disable = true;
    },
    enableLock() {
      this.disable = false;
    },

    async authLogin(email: string, password: string) {
      const res = await API.auth.login(email, password);
      this.setToken(res.data.token);
    },

    async authSignup(name: string, email: string, password: string) {
      await API.auth.signup(name, email, password);
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem('plant-iq-token', token);
      try {
        this.user = jwtDecode(this.token);
      } catch (e) {
        this.user = {
          id: -1,
          email: '',
          username: '',
        };
      }
    },

    logout() {
      this.token = '';
      this.user = {
        id: -1,
        email: '',
        username: '',
      };
      localStorage.removeItem('plant-iq-token');
    },
  },
});

export const useGlobalStoreWithOut = (): any => {
  return useGlobalStore(store);
};
