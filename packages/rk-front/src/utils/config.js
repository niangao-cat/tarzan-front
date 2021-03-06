/*
 * Config - 全局统一配置
 * @Author: jiangruiqi
 * @Date: 2019-05-09 14:31:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-02 09:38:57
 */
// import { API_HOST as host } from 'utils/config';

export const CLIENT_ID = `${process.env.CLIENT_ID}`;
export const API_HOST = `${process.env.API_HOST}`;
export const BPM_HOST = `${process.env.BPM_HOST}`;
export const WEBSOCKET_URL = `${process.env.WEBSOCKET_HOST}`;

export const HZERO_SPC = '/system';
export const HZERO_OAUTH = '/oauth';
export const HZERO_PLATFORM = '/hpfm';
export const HZERO_IAM = '/iam';
export const HZERO_DTT = '/hdtt';
export const HZERO_MSG = '/hmsg';
export const HZERO_PTL = '/hptl';
export const HZERO_WFL = '/hwfl';
export const HZERO_DTW = '/hdtw';
export const HZERO_HDTW = '/hdtw';
export const HZERO_SDR = '/hsdr';
export const HZERO_HSGP = '/hsgp';
export const HZERO_HITF = '/hitf';
export const HZERO_HFLE = '/hfle';
export const HZERO_IMP = '/himp';
export const HZERO_RPT = '/hrpt';
export const HZERO_HCNF = '/hcnf';
export const HZERO_ASGARD = '/hagd';

export const HZERO_FILE = `${API_HOST}${HZERO_HFLE}`;
export const AUTH_HOST = `${API_HOST}${HZERO_OAUTH}`;
export const AUTH_URL = `${AUTH_HOST}/oauth/authorize?response_type=token&client_id=${CLIENT_ID}`;
export const AUTH_LOGOUT_URL = `${AUTH_HOST}/logout`;
export const AUTH_SELF_URL = `${API_HOST}${HZERO_IAM}/hzero/v1/users/self`;

export const VERSION_IS_OP = `${process.env.PLATFORM_VERSION}` === 'OP'; // OP版

/* export const Host =
  process.env.NODE_ENV === 'production' ? `${host}/mes` : 'http://192.168.20.70:8080/mes'; */
export const Host = '/mes';
export const ReportHost = '/mes-report';
