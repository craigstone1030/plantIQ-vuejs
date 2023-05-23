import { appHttp } from '@/axios';

export default {
  async login(email: string, password: string) {
    return await appHttp.get('/login', {
      params: {
        email,
        password,
      },
    });
  },

  async signup(name: string, email: string, password: string) {
    return await appHttp.get('/signup', {
      params: {
        username: name,
        email,
        password,
      },
    });
  },
};
