import React from 'react'
import PropTypes from 'prop-types';

import TimeAgo from 'react-timeago'

// import { Header } from 'semantic-ui-react'

import * as GLOBAL from '../../../global';
import AccountAvatar from '../../elements/account/avatar'
import AccountLink from '../../elements/account/link';

export class Item extends React.Component {
  render() {
    let { item, showMeta, imageSize, titleSize } = this.props;
    let { title, author, created } = item;

    // if (itemStyle === "Style1") {
    //   return (
    //     <div className="item">
    //       <div className="image" style={{maxHeight: "100px", overflow: "hidden"}}><img src={image} /></div>
    //       <div className="content">
    //         <a className="ui small header">{title}</a>
    //         <div className="meta">
    //           <AccountAvatar username={author} style={{minHeight: '35px', minWidth: '35px', marginBottom: 0, marginRight: '1em'}} />
    //           <AccountLink username={author} />
    //           <br/>
    //           <TimeAgo date={`${created}Z`} />
    //         </div>
    //         {/*<div className="description">*/}
    //         {/*<p><img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" className="ui wireframe image" /></p>*/}
    //         {/*</div>*/}
    //         <div className="extra">{children} comments</div>
    //       </div>
    //     </div>
    //   )
    // } elseif (itemStyle === "Style2") {
    //   return (
    //     <div className="item">
    //       <div className="ui tiny image"><img src={image}/></div>
    //       <div className="middle aligned content">{title}</div>
    //     </div>
    //   )
    // } else if (itemStyle === "Style3") {
    //   return (
    //     <div className="item">
    //       <div className="ui small image"><img src={image} /></div>
    //       <div className="content">
    //         <a className="ui small header">{title}</a>
    //         <div className="meta">
    //           <AccountAvatar username={author} style={{minHeight: '35px', minWidth: '35px', marginBottom: 0, marginRight: '1em'}} />
    //           <AccountLink username={author} />
    //           <br/>
    //           <TimeAgo date={`${created}Z`} />
    //         </div>
    //         {/*<div className="description">*/}
    //           {/*<p><img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" className="ui wireframe image" /></p>*/}
    //         {/*</div>*/}
    //         <div className="extra">{children} comments</div>
    //       </div>
    //     </div>
    //   )
    // } else if (itemStyle === "Style4") {
    //   return (
    //     <div className="item">
    //       <div className="ui tiny image"><img src={image} /></div>
    //       <div className="content">
    //         <div className="ui small header">{title}</div>
    //         {/*<div className="description">*/}
    //           {/*<p><img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" className="ui wireframe image" /></p>*/}
    //         {/*</div>*/}
    //         <div className="meta">
    //           <AccountAvatar username={author} style={{minHeight: '35px', minWidth: '35px', marginBottom: 0, marginRight: '1em'}} />
    //           <AccountLink username={author} />
    //           <br/>
    //           <TimeAgo date={`${created}Z`} />
    //         </div>
    //       </div>
    //     </div>
    //   )
    // } else {
    //   return (
    //     <div>Invalid itemStyle</div>
    //   )
    // }

      let imageSrc = "https://semantic-ui.com/images/wireframe/image.png";
      try {
        imageSrc = item.json_metadata.image[0];
      } catch(e) {
      }
      let htmlImage = <div className={"ui image " + imageSize} style={{overflow: 'hidden', maxHeight: '10em'}}><img alt="" src={imageSrc} /></div>;
      let htmlTitle = <div className={titleSize}>{title}</div>;

      let meta = null;
      if (showMeta) {
        meta = (
          <div className="meta">
            <AccountAvatar username={author} style={{minHeight: '35px', minWidth: '35px', marginBottom: 0, marginRight: '1em'}} />
            <AccountLink username={author} />
            <br/>
            <TimeAgo date={`${created}Z`} />
          </div>
        );
      }

      return (
        <div className="item">
          {htmlImage}
          <div className="content">
            {htmlTitle}
            {/*<div className="description">*/}
              {/*<p><img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" className="ui wireframe image" /></p>*/}
            {/*</div>*/}
            {meta}
          </div>
        </div>
      )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  showMeta: PropTypes.bool.isRequired,
  imageSize: PropTypes.string.isRequired,
  titleSize: PropTypes.string.isRequired
}




export default class Section1 extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    feed: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    showMeta: PropTypes.bool,
    imageSize: PropTypes.string,
    titleSize: PropTypes.string
  }

  static defaultProps = {
    showMeta: true,
    imageSize: 'tiny',
    titleSize: 'ui header tiny'
  }

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loadingPosts: false
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    // console.log("loadData1");

    this.setState({
      posts: [],
      loadingPosts: true
    });

    try {
      let url = `${ GLOBAL.REST_API }/forum/${this.props.feed}?page=1`

      if (this.props.feed.startsWith('/newspage/')) {
        url = `${ GLOBAL.REST_API }${this.props.feed}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const result = await response.json()
        // If a valid forum is found
        if (result.status === 'ok') {
          // and we have data
          if (result.data && (!result.meta || result.meta.configured !== false)) {
            // display the forum
            this.setState({
              loadingPosts: false,
              posts: result.data.slice(0, this.props.max)
            });
          }
        }
        // If this forum is not found, but we have a reservation
        if (result.status === 'not-found') {
        }
      } else {
        console.error(response.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        <h4 className="ui dividing header">{this.props.title}</h4>
        <div className="ui items">
          {this.state.posts.map(item => {
            return <Item {...this.props} key={item._id} item={item} />
          })}
        </div>
        {/*<div className="ui centered banner test ad"></div>*/}
      </div>
    )
  }
}
