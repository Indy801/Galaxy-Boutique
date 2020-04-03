import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { CircularProgress, Typography } from '@material-ui/core'

class CompanyPages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageInfo: null,
    }
  }

  componentDidMount() {
    const { location: { pathname } } = this.props
    this.fetchPage(pathname)
  }

  componentDidUpdate(prevProps) {
    let oldurl = prevProps.location.pathname
    let newurl = this.props.location.pathname
    if (newurl !== oldurl)
      this.fetchPage(this.props.location.pathname)
  }

  fetchPage = (pathname) => {
    Axios({
      method: "get",
      url: `/api/pages${pathname}`
    }).then(response => {
      this.setState({ pageInfo: response.data })
    })
  }

  render () {
    if (this.state.pageInfo == null) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    } else {
      return (
        <div>
          <Typography variant="h3">{ this.state.pageInfo.title }</Typography>
          <Typography variant="body1">{ this.state.pageInfo.content }</Typography>
        </div>
      );
    }
  }
}

export default CompanyPages
