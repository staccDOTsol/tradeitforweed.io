import React from 'react';
import { Grid } from 'semantic-ui-react';
import Iframe from 'react-iframe';
import Section1 from './newspage/Section1';

export default class NewsPage extends React.Component {

  render() {
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            <Section1 title="General" feed="tradeitforweed-general" imageSize="small" titleSize="ui header tiny" max={3} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={4} computer={4}>
            <Section1 title="Announcements" feed="tradeitforweed-announcements" imageSize="mini" titleSize="small" showMeta={false} max={7} />
            {/*<div className="ui divider"></div>*/}
          </Grid.Column>
          <Grid.Column mobile={16} tablet={4} computer={4}>
            {/*<div className="ui small vertical rectangle test ad" data-text="Small Rectangle"></div>*/}
            <Iframe url="https://discordapp.com/widget?id=434637602902114304&theme=light" position="relative" width="100%" height="425px" />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Section1 title="Most Votes" feed="/newspage/voted" titleSize="tiny" max={5} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Section1 title="Recent" feed="/newspage/recent" titleSize="tiny" max={5} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={4} computer={4}>
            <Iframe url="/widget_price.html" position="relative" width="100%" height="220px" />
            <Iframe url="https://tgwidget.com/widget/count/?id=5a5df73183ba8879648b4567" position="relative" width="100%" height="50px" />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            <Section1 title="Canada" feed="tradeitforweed-canada" titleSize="ui header tiny" max={3} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            <Section1 title="Smoke" feed="tradeitforweed-smoke2" titleSize="ui header tiny" max={3} />
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  }
}
