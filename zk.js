var ZK = require ("zookeeper").ZooKeeper;

function new_zk(hosts,zkclient){
    var zk = new ZK();
    zk.init ({connect:hosts, timeout:20000, debug_level:ZK.ZOO_LOG_LEVEL_WARNING, host_order_deterministic:false});
    zk.on (ZK.on_connected, function (zkk) {
        console.log ("zk session established, id=%s", zkk.client_id);
    });
    zk.on(ZK.on_closed,function(zkk){
        //re-initialize
        console.log("zk session close,re-init it");
        zkclient.zk=new_zk(hosts,zkclient);
    });
    return zk;
}

function ZkClient(hosts){
    this.zk=new_zk(hosts,this);
}

module.exports.ZkClient=ZkClient




