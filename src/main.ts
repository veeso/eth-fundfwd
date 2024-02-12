import dotenv from 'dotenv';
import schedule from 'node-schedule';

import Config, { readConfigFile } from './config';
import writePidfile from './pidfile';
import { forwardEth } from './fwdEth';
import { Alchemy, Network } from 'alchemy-sdk';
import { error, info, warn } from './log';

dotenv.config();

const { ALCHEMY_APIKEY, JSON_CONFIG, OUTPUT_ADDRESS, PIDFILE } = process.env;

// read configuration from JSON_CONFIG
const config: Config = readConfigFile(JSON_CONFIG);

const provider = new Alchemy({
  apiKey: ALCHEMY_APIKEY,
  network: Network.ETH_MAINNET,
});

// for each address in config, create a task runner
for (const [address, privKey] of Object.entries(config)) {
  schedule.scheduleJob('* * * * * *', () => {
    info('running job for', address);
    forwardEth(provider, address, privKey, OUTPUT_ADDRESS)
      .then((tx) => {
        if (tx) {
          info('Sent funds for', tx.value.toString(), 'wei. Tx hash:', tx.hash);
        }
      })
      .catch((e) => {
        error('failed to execute job for', address, e);
      });
  });
}

// write pidfile
writePidfile(PIDFILE);

process.on('SIGINT', () => {
  schedule
    .gracefulShutdown()
    .then(() => {
      warn('scheduler terminated');
    })
    .catch((e) => {
      error('failed to shutdown scheduler', e);
    });
});
