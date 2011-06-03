##node-zk-browser

A zookeeper web browser in node.js. It's based on express and node-zookeeper.

##Configure

Edit app.js to configure your zk hosts

     zk.init ({connect:"localhost:2181", timeout:200000, debug_level:ZK.ZOO_LOG_LEVEL_WARNING, host_order_deterministic:false});

##Run
Type command to start app

        node app.js
