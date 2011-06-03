LOGFILE=$(dirname $0)/logs/node-zk-browser.log

nohup node $(dirname $0)/app.js 2>&1 >>$LOGFILE &
tail $LOGFILE -f
