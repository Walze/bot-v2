import { JSDOM } from 'jsdom';
import Axios from 'axios';
import { DiscordAction } from '../../classes/Command';

export const googleAction: DiscordAction = (msg, params) => {

  Axios.get(`https://www.google.com.br/search?q=${params.text}`)
    .then(res => {
      const dom = new JSDOM(res.data, {
        contentType: "text/html",
        includeNodeLocations: true
      })
      const doc = dom.window.document
      const linksOriginal = Array.from(doc.querySelectorAll('.g .r a')).map((el) => el.getAttribute('href') || '')

      // bypass
      let links = linksOriginal.map(lk =>
        lk.replace(/\/url\?q=/g, '')
          .replace(/&sa=.+/g, '')
          .replace(/%3D/g, '=')
          .replace(/%3F/g, '?')
          .replace(/%26/g, '&')
      )

      // remove images search
      links.filter(el => {
        if (el.indexOf('/search') < 0)
          return el
      })

      links = links.slice(0, Number(params.amount) || 1)

      const text = links.map((lk, i) => `
**__#${i + 1}__**
${lk}

`)
      msg.channel.send(text)
    })
}