import { defineStore } from 'pinia';
import { API } from '@/api';

interface DashboardState {
  chartData: any;
  monitors: any[];
  selectedProcessId: number;
  selectedDetectorId: number;
  startDt: Date;
  endDt: Date;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    chartData: {
      alert: {},
      histories: [],
      records: [],
    },
    monitors: [],
    selectedProcessId: -1,
    selectedDetectorId: -1,
    startDt: new Date(Date.now() - 3600 * 1 * 1000),
    endDt: new Date(Date.now() + 3600 * 1 * 1000),
  }),
  getters: {
    getSelectedProcessId(state) {
      return state.selectedProcessId;
    },

    getSelectedDetectorId(state) {
      return state.selectedDetectorId;
    },

    getMonitors(state) {
      return state.monitors;
    },

    getChartData(state) {
      return state.chartData;
    },
  },
  actions: {
    async loadChartDataByDetectorId() {
      const res = await API.detector.loadGraphDataByDetectorIdAndBetweenDates(
        this.selectedDetectorId,
        this.startDt,
        this.endDt
      );
      this.chartData = {
        alert: res.data.alert ? JSON.parse(res.data.alert) : {},
        histories: res.data.histories ? res.data.histories : [],
        records: res.data.records ? JSON.parse(res.data.records) : [],
      };
    },

    async loadMonitorsByProcessId() {
      this.selectedDetectorId = -1;
      const res = await API.process.loadMonitorsByProcessId(
        this.selectedProcessId
      );
      this.monitors = res.data;
    },

    setCurrentProcessId(id: number) {
      this.selectedProcessId = id;
      this.selectedDetectorId = -1;
    },

    setCurrentDetectorId(id: number) {
      this.selectedDetectorId = id;
    },
  },
});
