LOGFILE=$(dirname $0)/logs/node-zk-browser.log
export ZK_HOST="localhost:2181"
nohup node $(dirname $0)/app.js 2>&1 >>$LOGFILE &

