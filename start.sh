#!/bin/sh

echo "🚀 Neko Bot Starting..."

node -e "require('http').createServer((_,res)=>res.end('Bot Running')).listen(process.env.PORT||3000)"

npm start
