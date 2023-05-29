import { defineStore } from 'pinia';
import { API } from '@/api';
import { store } from '@/stores/index';
import { useGlobalStore, useGlobalStoreWithOut } from '@/stores/global';

interface DetectorState {
  metrics: string[];
  detectors: any[];
  detectorId: number;
  process: any;
  chartData: any[];
  startDt: Date;
  endDt: Date;
  lock: boolean;
}

export const useDetectorStore = defineStore('detector', {
  state: (): DetectorState => ({
    metrics: [],
    detectors: [],
    detectorId: -1,
    process: null,
    chartData: [],
    startDt: new Date(Date.now() - 3600 * 6 * 1000),
    endDt: new Date(Date.now() + 3600 * 6 * 1000),
    lock: false,
  }),

  getters: {
    getMetrics(state) {
      return state.metrics;
    },
    getDetectors(state) {
      return state.detectors;
    },
    getSelectedDetectorId(state) {
      return state.detectorId;
    },
    getSelectedDetector: function (state) {
      if (state.detectorId === -1) return null;
      return state.detectors.find(i => i.pk === state.detectorId);
    },
    getProcess(state) {
      return state.process;
    },
    getChartData(state) {
      return state.chartData;
    },
    getStartDt(state) {
      return useGlobalStore().startDt;
    },
    getEndDt(state) {
      return useGlobalStore().endDt;
    },
  },

  actions: {
    async createDetector(form: {
      processId: number;
      name: string;
      description: string;
      metricNames: string[];
    }) {
      await API.detector.createDetector(form);
      await this.loadDetectorList();
    },
    async updateStatus(id: number, status: boolean) {
      const res = await API.detector.updateStatusByDetectorId(id, status);
      const json = JSON.parse(res.data);
      this.detectors.map(i => {
        if (i.pk === id) {
          i.fields.status = parseInt(json.fields.status);
        }
      });
    },
    async updateDetector(id: number, detector: any) {
      await API.detector.updateDetector(id, detector);
      await this.loadDetectorList();
    },
    async deleteDetector(id: number) {
      await API.detector.deleteDetector(id);
      await this.loadDetectorList();
    },
    async loadDetectorList(force = true) {
      if (!force && this.detectors.length) return;
      const res = await API.detector.loadDetectorList();
      this.detectors = JSON.parse(res.data);
    },
    async loadMetricsByDetectorId(id: number) {
      const res = await API.detector.loadMetricsByDetectorId(id);
      this.metrics = res.data;
    },
    async loadProcessByDetectorId(id: number) {
      const res = await API.detector.loadProcessByDetectorId(id);
      this.process = JSON.parse(res.data);
    },
    async loadRecords() {
      this.lock = true;
      const res = await API.detector.loadRecordsByDetectorIdAndBetweenDates(
        this.detectorId,
        useGlobalStore().startDt,
        useGlobalStore().endDt
      );
      this.chartData = res.data;
      this.lock = false;
    },
    async loadMoreRecords(message: any) {
      const globalStore = useGlobalStoreWithOut();
      if (!this.lock) {
        const startTime = Math.min(
          globalStore.endDt.getTime(),
          new Date(message.startAt).getTime()
        );
        const endTime = Math.max(
          globalStore.endDt.getTime(),
          new Date(message.stopAt).getTime()
        );

        if (startTime < endTime) {
          const globalStore = useGlobalStoreWithOut();
          globalStore.disableLock();
          const res = await API.detector.loadRecordsByDetectorIdAndBetweenDates(
            this.detectorId,
            new Date(startTime),
            new Date(endTime)
          );
          globalStore.enableLock();
          this.chartData = this.chartData.concat(res.data);
        }
      }
    },
    setCurrentDetector(id: number) {
      this.detectorId = id;
      useGlobalStore().startDt = new Date(Date.now() - 3600 * 6 * 1000);
      useGlobalStore().endDt = new Date(Date.now() + 3600 * 6 * 1000);
      this.metrics = [];
      this.chartData = [];
      this.process = null;
    },
  },
});
export const useDetectorStoreWithOut = (): any => {
  return useDetectorStore(store);
};
