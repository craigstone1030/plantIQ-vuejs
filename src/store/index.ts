/** Vuex Store */
import { createStore } from '@logue/vue2-helpers/vuex';
import type {
  ActionContext,
  ActionTree,
  GetterTree,
  MutationTree,
  StoreOptions,
} from 'vuex';
import {
  API_CREATE_DATASOURCE,
  API_GET_DATASOURCE,
  API_GET_METRICS_BY_DB_ID,
  API_GET_STATISTICS_BY_METRIC_AND_BETWEEN_DATES,
} from '@/store/action';
import axios from 'axios';

export interface RootState {
  datasourceList: object[];
  metricsList: object[];
  chartData: object[];
  datasourceId: number;
  metric: string;
  startDt: Date;
  endDt: Date;

  overlay: boolean;
}

/** State */
const state: RootState = {
  datasourceList: [],
  metricsList: [],
  chartData: [],
  datasourceId: -1,
  metric: '',
  startDt: new Date('2022-01-01 00:00:00'),
  endDt: new Date(),

  overlay: false,
};

/** Getters */
const getters: GetterTree<RootState, RootState> = {
  datasourceList: s => s.datasourceList,
  metricsList: s => s.metricsList,
};

/** Mutation */
const mutations: MutationTree<RootState> = {
  [API_GET_DATASOURCE](state) {
    state.overlay = true;
    axios
      .get('http://localhost:8081/api/datasource/all')
      .then(res => {
        state.datasourceList = JSON.parse(res.data.data);
      })
      .finally(() => {
        state.overlay = false;
      });
  },
  [API_CREATE_DATASOURCE](state, payload) {
    state.overlay = true;
    axios
      .post('http://localhost:8081/api/datasource/create', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        axios.get('http://localhost:8081/api/datasource/all').then(res => {
          state.datasourceList = JSON.parse(res.data.data);
        });
      })
      .finally(() => {
        state.overlay = false;
      });
  },
  [API_GET_METRICS_BY_DB_ID](state, id) {
    state.overlay = true;
    axios
      .get('http://localhost:8081/api/metric/all', {
        params: {
          dsId: id,
        },
      })
      .then(res => {
        state.datasourceId = id;
        state.metricsList = res.data.data;
      })
      .finally(() => {
        state.overlay = false;
      });
  },

  [API_GET_STATISTICS_BY_METRIC_AND_BETWEEN_DATES](state) {
    state.overlay = true;
    axios
      .get('http://localhost:8081/api/metric/load', {
        params: {
          dsId: state.datasourceId,
          metric: state.metric,
          startAt: state.startDt,
          stopAt: state.endDt,
        },
      })
      .then(res => {
        state.chartData = res.data.data;
      })
      .finally(() => {
        state.overlay = false;
      });
  },
};

/** Action */
const actions: ActionTree<RootState, RootState> = {
  loadDatasource(context: ActionContext<RootState, RootState>) {
    context.commit(API_GET_DATASOURCE);
  },
  createDatasource(context: ActionContext<RootState, RootState>, datasource) {
    context.commit(API_CREATE_DATASOURCE, datasource);
  },
  loadMetricsByDbId(context: ActionContext<RootState, RootState>, id) {
    context.commit(API_GET_METRICS_BY_DB_ID, id);
  },
  loadChartDataByMetricAndBetweenDates(
    context: ActionContext<RootState, RootState>
  ) {
    context.commit(API_GET_STATISTICS_BY_METRIC_AND_BETWEEN_DATES);
  },
};

/** VuexStore */
const store: StoreOptions<RootState> = {
  // https://next.vuex.vuejs.org/guide/strict.html#development-vs-production
  strict: import.meta.env.DEV,
  state,
  getters,
  mutations,
  actions,
  plugins: [
    /*
    // store as local storage using vuex-persist
    new VuexPersistence({
      key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE,
      storage: window.localStorage,
      modules: ['SomeModule'],
    }).plugin,
    // store as session storage
    new VuexPersistence({
      key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE,
      storage: window.sessionStorage,
      modules: ['SomeModule'],
    }).plugin,
    // store as Indexed DB (using vuex-persist-indexeddb)
    createPersistedState({
      key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE,
      paths: ['SomeLargeModule'],
    }),
    */
  ],
};

export default createStore(store);
