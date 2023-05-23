import { appHttp } from '@/axios';

export default {
  async createDetector(form: any) {
    return await appHttp.get('/api/detector/create', {
      params: {
        ...form,
        metricNames: JSON.stringify(form.metricNames),
      },
    });
  },
  async updateStatusByDetectorId(id: number, status: boolean) {
    return await appHttp.get('/api/detector/setstatus', {
      params: {
        detectorId: id,
        status: status ? 1 : 0,
      },
    });
  },
  async updateDetector(id: number, payload: any) {
    return await appHttp.get('/api/detector/update', {
      params: {
        ...payload,
        id,

        metricNames: JSON.stringify(payload.metricNames),
      },
    });
  },
  async deleteDetector(id: number) {
    return await appHttp.get('/api/detector/delete', {
      params: { id },
    });
  },
  async loadDetectorList() {
    return await appHttp.get('/api/detector/load');
  },
  async loadMetricsByDetectorId(id: number) {
    return await appHttp.get('/api/detector/metrics', {
      params: {
        detectorId: id,
      },
    });
  },
  async loadProcessByDetectorId(id: number) {
    return await appHttp.get('/api/detector/process', {
      params: {
        detectorId: id,
      },
    });
  },
  async loadRecordsByDetectorIdAndBetweenDates(
    id: number,
    startDt: Date,
    endDt: Date
  ) {
    return await appHttp.get('/api/detector/records', {
      params: {
        detectorId: id,
        startAt: startDt,
        stopAt: endDt,
      },
    });
  },
  async loadGraphDataByDetectorIdAndBetweenDates(
    id: number,
    startDt: Date,
    endDt: Date
  ) {
    return await appHttp.get('/api/detector/graphdata', {
      params: {
        detectorId: id,
        startAt: startDt,
        stopAt: endDt,
      },
    });
  },
};
