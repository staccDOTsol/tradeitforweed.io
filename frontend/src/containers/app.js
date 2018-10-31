import React from 'react'
// import { Helmet } from "react-helmet";
import { BrowserRouter, browserHistory, Route, Redirect } from 'react-router-dom';

//import * as steem from 'steem';

import steem from 'steem';

import { Container } from 'semantic-ui-react'

import Account from '../containers/account'
import IndexLayout from '../components/layouts/index'
import FeedLayout from '../components/layouts/feed'
import ForumLayout from '../components/layouts/forum'
// import ForumCreateLayout from '../components/layouts/forum/create'
import ForumsLayout from '../components/layouts/forums'
import RepliesLayout from '../components/layouts/replies'
import ThreadLayout from '../components/layouts/thread'
import TopicLayout from '../components/layouts/topic'
import NewsPage from '../components/layouts/newspage'


import BreadcrumbMenu from '../components/global/breadcrumb'
import FooterMenu from '../components/global/footer'
import HeaderMenu from '../components/global/menu'
import GlobalNotice from '../components/global/notice'

import './app.css'
import '../../node_modules/noty/lib/noty.css'

steem.api.setOptions({ url: 'https://tradeitforweed.io/wss' });
steem.config.set('address_prefix','SMK');
steem.config.set('chain_id','1ce08345e61cd3bf91673a47fc507e7ed01550dab841fd9cdb0ab66ef576aaf0');

/////////////////
// use withTracker:
// import withTracker from './withTracker'
// <Route exact path="/" component={withTracker(IndexLayout)} />

const App = () => (
    <BrowserRouter history={browserHistory}>
      <div className="AppContainer">
        {/*<Helmet>*/}
            {/*<title>tradeitforweedTalk</title>*/}
            {/*<meta name="description" content="Blockchain based decentralized forum software powered by the Smoke blockchain." />*/}
            {/*<meta name="viewport" content="width=device-width, initial-scale=1" />*/}
            {/*<meta itemprop="name" content="tradeitforweedTalk Forums" />*/}
            {/*<meta itemprop="description" content="Blockchain based decentralized forum software powered by the Smoke blockchain." />*/}
            {/*<meta itemprop="image" content="http://tradeitforweed.io/logo.png" />*/}
            {/*<meta name="twitter:card" content="summary" />*/}
            {/*<meta name="twitter:site" content="@tradeitforweedtalk" />*/}
            {/*<meta name="twitter:title" content="tradeitforweedTalk Forums" />*/}
            {/*<meta name="twitter:description" content="Blockchain based decentralized forum software powered by the Smoke blockchain." />*/}
            {/*<meta name="twitter:creator" content="@officialfuzzy" />*/}
            {/*<meta name="twitter:image:src" content="https://tradeitforweed.io/logo.png" />*/}
            {/*<meta property="og:title" content="tradeitforweedTalk Forums" />*/}
            {/*/!*<meta property="og:type" content="article" />*!/*/}
            {/*<meta property="og:type" content="website" />*/}
            {/*<meta property="og:url" content="https://tradeitforweed.io/" />*/}
            {/*<meta property="og:image" content="http://tradeitforweed.io/logo.png" />*/}
            {/*<meta property="og:image:secure_url" content="https://tradeitforweed.io/logo.png" />*/}
            {/*<meta property="og:image:type" content="image/png" />*/}
            {/*<meta property="og:image:width" content="103" />*/}
            {/*<meta property="og:image:height" content="132" />*/}
            {/*<meta property="og:image:alt" content="tradeitforweedTalk logo" />*/}
            {/*<meta property="og:description" content="Blockchain based decentralized forum software powered by the Smoke blockchain." />*/}
            {/*<meta property="og:site_name" content="tradeitforweedTalk" />*/}
        {/*</Helmet>*/}
        <HeaderMenu />
        <BreadcrumbMenu />
        <GlobalNotice />
        <Container>
          <Route exact path="/newspage" component={NewsPage}/>

          {/* <Route exact path="/" component={IndexLayout} /> */}
          <Route exact path="/" render={(props) => <Redirect to="/forums"/>}/>
          <Route path="/@:username" component={Account} />
          {/*<Route path="/create/forum" component={ForumCreateLayout} />*/}
          <Route path="/feed" component={FeedLayout} />
          <Route path="/forums" component={ForumsLayout} />
          <Route path="/forums/:group" component={IndexLayout} />
          <Route path="/f/:id/:section?" component={ForumLayout} />
          <Route path="/forum/:id" render={(props) => <Redirect to={`/f/${props.match.params.id}`}/>}/>
          <Route path="/replies" component={RepliesLayout} />
          <Route path="/topic/:category" component={TopicLayout} />
          <Route path="/:category/@:author/:permlink/:action?" component={ThreadLayout} />
        </Container>
        <BreadcrumbMenu />
        <FooterMenu />
      </div>
    </BrowserRouter>
)

export default App
