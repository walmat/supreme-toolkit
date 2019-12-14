import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import cheerio from 'cheerio';
import { MessageBuilder } from 'webhook-discord';

import models from '../models';
import flags from './flags';

export default class Supreme {
    constructor(proxy, webhook) {
        this.fetchInterval = null;
        this.webhook = webhook;
        this.agent = proxy ? new HttpsProxyAgent(proxy) : null;
        this.pookyActivated = false;

        this.tohru = null;
        this.url = null;
        this.timestamp = null;
        this.region  = null;
    }

    async fetchSite() {
        try {
            const res = await fetch('https://www.supremenewyork.com/mobile', {
                agent: this.agent,
            });
            const body = await res.text();
            return body;
        } catch (error) {
            // todo...
            console.log('ERROR FETCHING SITE: ', error);
            return null;
        }
    }

    async detectPooky($) {
        let tohru;
        let url;

        try {
            $('script').each((_, el) => {
                const src = $(el).attr('src');
                const contents = $(el).html();
    
                if (/tohru/i.test(contents)) {
                    [, tohru] = contents.match(/.*=\s"(.*)"/);
                }
    
                if (src && /pooky/i.test(src)) {
                    url = `${src}`.startsWith('http') ? src : `https:${src}`;
                }
            });
        } catch (e) {
            // todo...
            console.error(e);
            return null;
        }
        

        // first detection it turned on..
        if (tohru && url && !this.tohru && !this.url) {
            this.tohru =tohru;
            this.url = url;
            this.timestamp = Date.now();
            const pooky = new models.Pooky({
                active: this.pookyActivated,
                region: this.region,
                tohru: this.tohru,
                url: this.url,
                timestamp: this.timestamp,
            });

            if (!this.webhook) {
                return pooky.save();
            }

            const embed = new MessageBuilder()
                .setName("🔔 Pooky Enabled! 🔔")
                .setColor("#FB8B24")
                .addField("New Pooky Version", "Region: " + flags[this.region])
                .addField("URL", this.url)
                .addField("Tohru", this.tohru)
                .setTime();
    
            await Promise.all([pooky.save(), this.webhook.send(embed)]);
        // first detection it turned off..
        } else if (!tohru && !url && this.tohru && this.url) {
            const pooky = new models.Pooky({
                active: this.pookyActivated,
                region: this.region,
                tohru: this.tohru,
                url: this.url,
                timestamp: this.timestamp,
            });

            if (!this.webhook) {
                await pooky.save();

                // reset trigger members...
                this.tohru = null;
                this.url = null;
                return;
            }

            const embed = new MessageBuilder()
                .setName("🔔 Pooky Disabled! 🔔")
                .setColor("#A8C686")
                .addField("Pooky Version", "Region: " + flags[this.region])
                .addField("URL", this.url)
                .addField("Tohru", this.tohru)
                .setTime();
    
            await Promise.all([pooky.save(), this.webhook.send(embed)]);
    
            // reset trigger members...
            this.tohru = null;
            this.url = null;
        }
    }

    async loadForm(body) {
        try {
            return cheerio.load(body);
        } catch (error) {
            console.log('ERROR LOADING FORM: ', error);
            // todo...
            return null;
        }
    }

    async parseForm($) {
        try {
            const data = [];
            $('input, textarea, select, button').each((_, el) => {
                const name = $(el).attr('name');
                const value = $(el).attr('value') || '';
    
                // blacklist some values/names
                if (/qty|size-options/i.test(name)) {
                    return;
                }
    
                if (name) {
                    data.push({ name, value });
                }
            });
            return data;
        } catch (e) {
            // todo...
            console.error(e);
            return null;
        }
       
    }

    async processForm($) {
        try {
            const checkoutForm = $('script#checkoutViewTemplate').html();

            $ = await this.loadForm(checkoutForm);
            const form = await this.parseForm($);

            const model = new models[this.region]({ data: form });
            await model.save();
        } catch (e) {
            // todo..
            console.error(e.message);
            return null;
        }
    }

    async run() {
        const body = await this.fetchSite();

        if (!body) {
            console.error('[DEBUG]: Body not present');
            return;
        }

        let $ = await this.loadForm(body);

        if (!$) {
            console.log('[DEBUG]: Selector not present');
            return;
        }

        this.region = $('body').hasClass('eu') ? 'EU' : ($('body').hasClass('us') ? 'US' : 'JP');

        // kick off the form and pooky parsers...
        return Promise.all([await this.processForm($), await this.detectPooky($)]);
    }

    async start(ms) {
        await this.run();
        this.fetchInterval = setInterval(async () => await this.run(), ms);
    }
}