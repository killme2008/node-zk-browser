##node-zk-browser

A zookeeper web administrator in node.js. It's based on express.js and node-zookeeper.

##Configure

Edit app.js to configure your zk hosts

     var zkclient = new ZkClient("localhost:2181");

Edit user.json to configure your administrator account:

     { "name" : "password"}

##Run
Type command to start app

        ./start.sh

#Lisense

        Apache License Version 2.0
