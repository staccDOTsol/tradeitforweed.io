import React, { Component } from 'react'
import { Container, Grid, Segment } from 'semantic-ui-react'
// import { Link } from 'react-router-dom'

export default class HeaderMenu extends Component {
  render() {
    return (
      <Segment inverted vertical className="footer" style={{backgroundColor: '#061d32', marginTop: "2em"}}>
        <Container>
          <Grid stackable className="divided equal height stackable">
            {/*
            <Grid.Column width={3}>
              <h4 class="ui inverted header">About</h4>
              <List class="ui inverted link list">
                <Link to="#" className="item">Sitemap</Link>
                <Link to="#" className="item">Contact Us</Link>
                <Link to="#" className="item">Religious Ceremonies</Link>
                <Link to="#" className="item">Gazebo Plans</Link>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <h4 class="ui inverted header">Services</h4>
              <List class="ui inverted link list">
                <Link to="#" className="item">Banana Pre-Order</Link>
                <Link to="#" className="item">DNA FAQ</Link>
                <Link to="#" className="item">How To Access</Link>
                <Link to="#" className="item">Favorite X-Men</Link>
              </List>
            </Grid.Column>
            */}
            <Grid.Column width={16} textAlign='center'>

              <h4 className="ui inverted header">
                <img alt="logo" src="/logo.png" className="ui image" />
                tradeitforweed.io/
              </h4>
              <p>the <a href='https://tradeitforweed.io/' target='_new'> tradeitforweed </a> Community, beta version, powered by <a href='https://smoke.io/' target='_new'> Smoke</a></p>

            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    )
  }
}
