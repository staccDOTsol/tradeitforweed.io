import React from 'react'

import { Grid } from 'semantic-ui-react'

import Forum from '../../containers/forum'
import Sidebar from '../../containers/sidebar'

export default class ForumLayout extends React.Component {
  render() {
    const { id, section } = this.props.match.params;
    const pageNo = parseInt(this.props.match.params.pageNo, 10) || 1;

    return(
      <Grid>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Forum forumid={id} section={section} pageNo={pageNo} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
