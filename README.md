##node-zk-browser

A zookeeper web administrator in node.js. It's based on [express.js](http://expressjs.com/) and [node-zookeeper](https://github.com/yfinkelstein/node-zookeeper).It will display zookeeper's data as a lazy loading tree,and display every path's stat info and data;and you can create,edit or delete path if you logon.

##Configure

Edit app.js to configure your zk hosts

     var zkclient = new ZkClient("localhost:2181");

Edit user.json to configure your administrator account:

     { "name" : "password"}

##Run
Type command to start app

        ./start.sh

You can visit node-zk now at

    http://localhost:3000

#Lisense
        Apache License Version 2.0

See LICENSE.txt file in the top level folder.

#Author
Dennis Zhuang(killme2008@gmail.com)
