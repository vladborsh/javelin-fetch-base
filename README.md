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

Environment variables which you can configure (set it as a proccess env if you run it outside docker)

- WORKERS - workers number
- SITES - URL where we grab sites which will be attacked 
- PROXIES -  URL where we grab list of proxies
- ATTACKS_PER_TARGET - number of attacks per target
- CONFIGURATION_INVALIDATION_TIME - config refresh interval
