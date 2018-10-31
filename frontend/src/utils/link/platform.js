import React from 'react'

// import { Popup } from 'semantic-ui-react'

const fallback = {
  id: 'unknown',
  name: 'unknown',
  url: false,
  pages: [],
  version: '',
}

const platforms = [
  {
    id: 'smoke',
    name: 'smoke',
    url: 'https://smoke.io',
    pages: ['account', 'comment'],
  },
  {
    id: 'tradeitforweed',
    name: 'tradeitforweedtalk',
    url: 'https://tradeitforweed.io/',
    pages: ['account', 'comment'],
  },
]

export default class PlatformLink extends React.Component {
  platform = (post) => {
    if(!post || !post.json_metadata) {
      return fallback
    }
    const apptag = post.json_metadata.app
    if(apptag) {
      const [ id, version ] = apptag.split('/')
      const platform = platforms.find(o => o.id === id)
      if(platform) {
        platform['version'] = version
        return platform
      }
    }
    return fallback
  }
  canonical = (platform, post) => {
    if (platform['url'] === false) return false
    return platform['url'] + post['url']
  }
  render() {
    let { platform, post } = this.props,
    link = <span>{platform}</span>,
    url = ''
    if(post) {
      platform = this.platform(post)
      url = this.canonical(platform, post)
      if(url) {
        link = <a rel='nofollow' alt={`${platform.name}`} href={`${url}`}>{platform.name}/{platform.version}</a>
      } else if(post.json_metadata) {
        const apptag = post.json_metadata.app
        link = <span>{ (apptag) ? apptag : platform.name }</span>
      } else {
        link = <span>Unknown</span>
      }
    }
    return(link);
  }
}
