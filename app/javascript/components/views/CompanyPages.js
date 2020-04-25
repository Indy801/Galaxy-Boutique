import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import { CircularProgress, Typography, Box, Link, withStyles, Divider } from '@material-ui/core'
import { grey, blue } from '@material-ui/core/colors'
import MarkDown from 'markdown-to-jsx'

const style = theme => ({
  codeBlock: {
    backgroundColor: grey[200],
    padding: `1px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
  },
  codeLine: {
    backgroundColor: grey[200],
    padding: '0px 4px',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
})


const options = {
  overrides: {
    h1: { component: props => <Typography gutterBottom variant="h4" {...props} /> },
    h2: { component: props => <Typography gutterBottom variant="h6" {...props} /> },
    h3: { component: props => <Typography gutterBottom variant="subtitle1" {...props} /> },
    h4: { component: props => <Typography gutterBottom variant="caption" paragraph {...props} /> },
    p: { component: props => <Typography paragraph {...props} /> },
    a: { component: props => <Link style={{color: blue[500]}} {...props} /> },
    li: {
      component: props => (
        <li>
          <Typography component="span" {...props} />
        </li>
      ),
    },
    pre: {
      component: withStyles(style)(({ classes, ...props }) => (
        <Box className={classes.codeBlock}>
          <pre {...props} />
        </Box>
      )),
    },
    code: {
      component: withStyles(style)(({ classes, ...props }) => (
        <span className={classes.codeLine}>
          <code {...props} />
        </span>
      )),
    },
    hr: { component: withStyles(style)(({ classes, ...props }) => <Box className={classes.divider}><Divider {...props} /></Box> )},
  },
};

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
          <Box mt={3}>
            <MarkDown options={options}>{ this.state.pageInfo.content }</MarkDown>
          </Box>
        </div>
      );
    }
  }
}

export default CompanyPages
