import { Fragment } from 'react';
import React, { Component } from 'react';

import './Layout.css';

import NavigationBar from './NavigationBar';

// const Layout = (props) => {
class Layout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const url = window.location.href
    const subCheck = url.includes('subscription')
    const naviBar = subCheck? <div/> : <NavigationBar/>
    console.log(naviBar)
    return (
      <Fragment>
        {naviBar}
        <main>
          <div className="container">{this.props.children}</div>
        </main>
      </Fragment>
    );
  };
}


export default Layout;
