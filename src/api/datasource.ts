import { appHttp } from '@/axios';
import { useGlobalStore, useGlobalStoreWithOut } from '@/stores/global';

export default {
  async loadDatasource() {
    return await appHttp.get('/api/datasource/all');
  },
  async createDatasource(payload: any) {
    return await appHttp.get('/api/datasource/create', {
      params: {
        ...payload,
      },
    });
  },
  async updateDatasource(id: number, payload: any) {
    return await appHttp.get('/api/datasource/update', {
      params: {
        ...payload,
        id,
      },
    });
  },
  async deleteDatasource(id: number) {
    return await appHttp.get('/api/datasource/delete', {
      params: { id },
    });
  },
  async loadMetricsByDbId(id: number) {
    return await appHttp.get('/api/metric/all', {
      params: {
        dsId: id,
      },
    });
  },
  async loadChartDataByMetricAndBetweenDates(
    datasourceId: number,
    metric: string,
    startDt: Date,
    endDt: Date
  ) {
    return await appHttp.get('/api/metric/load', {
      params: {
        dsId: datasourceId,
        metric,
        startAt: startDt,
        stopAt: endDt,
      },
    });
  },
};
