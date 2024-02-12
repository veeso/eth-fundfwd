#!/bin/bash

cd "$(dirname "$0")" || exit 1

OP="$1"

NODE=$(which node)
if [ -z "$NODE" ]; then
  export NVM_DIR="/root/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  nvm use 18
fi

start() {
  yarn && yarn build
  screen -S eth-fundfwd -d -m yarn start

  return $?
}

stop() {
  PID=$(cat /var/run/eth-fundfwd.pid)

  kill "$PID"

  return $?
}

case "$1" in

  "start")
    start
    ;;
  
  "stop")
    stop
    ;;
  
  *)
    "unknown operation $OP"
    exit 1
    ;;

esac