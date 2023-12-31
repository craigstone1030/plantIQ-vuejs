import AuthAPI from '@/api/auth';
import DatasourceAPI from '@/api/datasource';
import ProcessAPI from '@/api/process';
import DetectorAPI from '@/api/detector';
import AlertAPI from '@/api/alert';

export const API = {
  auth: AuthAPI,
  datasource: DatasourceAPI,
  process: ProcessAPI,
  detector: DetectorAPI,
  alert: AlertAPI,
};
