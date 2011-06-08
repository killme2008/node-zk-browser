/**
 * Module dependencies.
 */

var express = require('express');
var path=require('path');
var fs=require('fs');
var util=require('util');
var ZkClient=require('./zk.js').ZkClient;
var zkclient = new ZkClient("localhost:2181");

var users = JSON.parse(fs.readFileSync(path.join(__dirname,'user.json'), 'utf8'));
var app = module.exports = express.createServer();

process.on('uncaughtException', function (err) {
  console.error('Caught exception: ' + err);
});


// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.cookieParser());
    app.use(express.session({ secret: "node zk browser" }));
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
    res.render('index', { });
});
//display tree
app.get('/tree', function(req, res){
    var path=req.query.path || "/";
    res.render('tree', {layout:false,'path':path  });
});

//login
app.post("/login",function(req,res){
    var user=req.body.user;
    if(users[user.name]==user.password){
        req.session.user=user.name
        req.session.cookie.maxAge=5*60*1000;
    }
    res.redirect(req.header('Referer'));
});

app.post("/delete",function(req,res){
    if(req.session.user){
        var path=req.body.path;
        var version=Number(req.body.version);
        zkclient.zk.a_delete_(path,version,function(rc,err){
            if(rc!=0)
                res.send(err);
            else
                res.send("Delete ok");
        });
    }else{
        res.send("Please logon");
    }
});

app.get("/create",function(req,res){
    res.render("create",{layout:false,user: req.session.user});
});

app.post("/create",function(req,res){
    if(req.session.user){
        var path=req.body.path;
        var data=req.body.data;
        var flag=Number(req.body.flag);
        zkclient.zk.a_create(path,data,flag,function(rc,err,path){
            if(rc!=0)
                res.send(err);
            else
                res.send("Create ok");
        });
    }else{
        res.send("Please logon");
    }
});

app.post("/edit",function(req,res){
    if(req.session.user){
        var path=req.body.path;
        var new_data=req.body.new_data;
        var version=Number(req.body.version);
        zkclient.zk.a_set(path,new_data,version,function(rc,err,stat){
            if(rc!=0){
                res.send(err);
            }else
                res.send("set ok");
        });
    }else{
        res.send("Please logon");
    }
});

//query data
app.get("/get",function(req,res){
    var path=req.query.path || "/";
    zkclient.zk.a_get(path,null,function(rc,err,stat,data){
        if(rc!=0){
            res.send(err);
        }else{
            res.render("data",{ layout: false, 'stat':stat,'data':data,'path':path,'user': req.session.user});
        }
    });
});

//query children
app.get('/children',function(req,res){
    var parenPath=req.query.path || '/';
    zkclient.zk.a_get_children(parenPath,null,function(rc,error,children){
        res.header("Content-Type","application/json");
        var result=[];
        if(rc==0){
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
        }
        res.send(result);
    });

});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
