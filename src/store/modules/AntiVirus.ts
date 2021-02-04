import { CommitFunction } from '@/types/custom.d';

const zerorpc = require('zerorpc');
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  MalDetected: 0,
  FileScanned: 0,
  ScannedList: [],
};
interface ScanResults {
  FilePath: string;
  malicious: boolean;
}
interface State{
  MalDetected: number;
  FileScanned: number;
  ScannedList: ScanResults[];
}

interface AVResponse {
  files_scanned: number;
  mal_detected: number;
  scanned_list: ScanResults[];
}

const getters = {
  MalDetected: (state: State) => state.MalDetected,
  FileScanned: (state: State) => state.FileScanned,
  ScannedList: (state: State) => state.ScannedList,
};

const actions = {
  RetrieveAVInfo({ commit }: CommitFunction) {
    const client = new zerorpc.Client({ heartbeatInterval: 10000 });
    client.connect('tcp://127.0.0.1:4242');
    client.on('error', (error: string) => {
      console.error('RPC client error:', error);
    });
    client.invoke('av_scan', (error: string, res: string) => {
      const ResObj = JSON.parse(res);
      console.log(ResObj);
      commit('SetAVInfo', ResObj);
      client.close();
    });
  },
};

const mutations = {
  SetAVInfo: (state: State, AvResponse: AVResponse): void => {
    state.ScannedList = AvResponse.scanned_list;
    state.FileScanned = AvResponse.files_scanned;
    state.MalDetected = AvResponse.mal_detected;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};