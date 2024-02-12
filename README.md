# Eth-FundFwd

Ethereum fund forwarding

## Introduction

Ethereum Fund Forwarding (Eth-FundFwd) is a NodeJS daemon which can be configured to listen on a list of provided ethereum address (paired with private keys) and fetches every seconds its balance and forwards the entire balance to a configurable output address.

## Get started

### Install dependencies

Install the dependencies with yarn and build the project

```sh
yarn
yarn build
```

### Setup the environment

```sh
cp .env.example .env
```

Change the env variables in `.env`

```env
ALCHEMY_APIKEY="YOUR_APIKEY"
OUTPUT_ADDRESS="YOUR_ETH_ADDRESS"
JSON_CONFIG="./config.json"
PIDFILE="/var/run/eth-fundfwd.pid"
```

Setup the addresses the daemon will listen to

```json
{
  "0x9a6d82ef3912d5ab60473124bccd2f2a640769d7": "70f1384b24df3d2cdaca7974552ec28f055812ca5e4da7a0ccd0ac0f8a4a9b00",
  "0x65463bf6268e5cc409b6501ec846487b935a1446": "ad0352cfc09aa0128db4e135fcea276523c400163dcc762a11ecba29d5f0a34a"
}
```

### Run it

```sh
yarn start
```

or use it with daemon or systemctl

```sh
./eth-fundfwd.sh start
```

## License

Eth-fundfwd is licensed under the **MIT License**

Read the license [HERE](./LICENSE)
