/**
 * Module dependencies.
 */

var express = require('express');
var path=require('path');
var util=require('util');
var ZK = require ("zookeeper").ZooKeeper;
var zk = new ZK();
zk.init ({connect:"localhost:2181", timeout:200000, debug_level:ZK.ZOO_LOG_LEVEL_WARNING, host_order_deterministic:false});
zk.on (ZK.on_connected, function (zkk) {
    console.log ("zk session established, id=%s", zkk.client_id);
});
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

//index
app.get('/', function(req, res){
  res.render('index', {
  });
});
//display tree
app.get('/tree', function(req, res){
    var path=req.query.path || "/";
    res.render('tree', {layout:false,'path':path  });
});

//query data
app.get("/get",function(req,res){
    var path=req.query.path || "/";
    zk.a_get(path,null,function(rc,err,stat,data){
        if(rc!=0)
            throw new Error(err);
        res.render("data",{ layout: false, 'stat':stat,'data':data,'path':path});
    });
});
//query children
app.get('/children',function(req,res){
    var parenPath=req.query.path || '/';
    zk.a_get_children(parenPath,null,function(rc,error,children){
        if(rc!=0)
            throw new Error(error);
        var result=[];
        children.forEach(function(child){
            realPath=path.join(parenPath,child);
            result.unshift({
                attributes:{"path":realPath,"rel":"chv"},
                data:{
                    title : child,icon:"ou.png", attributes: { "href" : ("get?path="+realPath) }
                },
                state:"closed"
            });
        });
        res.header("Content-Type","application/json");
        res.send(result);
    });

});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
