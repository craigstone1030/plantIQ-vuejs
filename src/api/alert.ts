import { appHttp } from '@/axios';

export default {
  async loadAlertsByDetectorId(id: number) {
    return await appHttp.get('/api/detector/alerts', {
      params: {
        detectorId: id,
      },
    });
  },

  async createAlert(id: number, payload: any) {
    return await appHttp.get('/api/alert/create', {
      params: {
        ...payload,
        detectorId: id,
      },
    });
  },

  async updateAlert(id: number, payload: any) {
    return await appHttp.get('/api/alert/update', {
      params: {
        ...payload,
        id,
      },
    });
  },

  async deleteAlert(id: number) {
    return await appHttp.get('/api/alert/delete', {
      params: { id },
    });
  },

  async loadHistoryByAlertId(id: number) {
    return await appHttp.get('/api/alert/history', {
      params: { alertId: id },
    });
  },

  async setAlertStatus(id: number, status: boolean) {
    return await appHttp.get('/api/alert/setstatus', {
      params: { id, status },
    });
  },
};
