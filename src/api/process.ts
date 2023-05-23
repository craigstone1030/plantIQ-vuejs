import { appHttp } from '@/axios';

export default {
  async createProcess(form: any) {
    return await appHttp.get('/api/process/create', {
      params: {
        ...form,
        metricNames: JSON.stringify(form.metricNames),
      },
    });
  },
  async updateStatusByProcessId(id: number, status: boolean) {
    return await appHttp.get('/api/process/setstatus', {
      params: {
        processId: id,
        status: status ? 1 : 0,
      },
    });
  },
  async updateProcess(id: number, payload: any) {
    return await appHttp.get('/api/process/update', {
      params: {
        ...payload,
        id,

        metricNames: JSON.stringify(payload.metricNames),
      },
    });
  },
  async deleteProcess(id: number) {
    return await appHttp.get('/api/process/delete', {
      params: { id },
    });
  },
  async loadProcessList() {
    return await appHttp.get('/api/process/all');
  },
  async loadMetricsByProcessId(id: number) {
    return await appHttp.get('/api/process/metrics', {
      params: {
        processId: id,
      },
    });
  },
  async loadDetectorsByProcessId(id: number) {
    return await appHttp.get('/api/process/detectors', {
      params: {
        processId: id,
      },
    });
  },
  async loadMonitorsByProcessId(id: number) {
    return await appHttp.get('/api/process/monitors', {
      params: {
        processId: id,
      },
    });
  },
};
