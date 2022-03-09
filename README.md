# javelin-ddoser

**Death to russian invaders**

## Install and run

- install node.js (preferably)
- install docker

For running
```
npm start
```

Or if you don't have node.js, you can simply
```
docker-compose up
```

also it is easy to deploy in [cloud](https://devcenter.heroku.com/articles/container-registry-and-runtime#cli) as a container

## Settings

You can configure your workers number via WORKERS env variable
SITES - sites which will be attacked 
PROXIES - list of proxies
