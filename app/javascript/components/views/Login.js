import React from "react"
import PropTypes from "prop-types"

import { Box, Grid, TextField, Typography, Button, Container } from "@material-ui/core";
import Axios from "axios";
import LoginToken from './shared/LoginToken'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      loginError: false,
      loggedIn: null,
      invalidText: null,
    }
  }

  componentDidMount() {
    Axios({
      method: "get",
      url: "/api/user/info",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      this.props.history.replace("/user")
    }).catch(error => {
      // console.log("No loggin")
    })
  }

  emailChanged = (event) => {
    this.setState({ email: event.target.value })
  }

  passwordChanged = (event) => {
    this.setState({ password: event.target.value })
  }

  confirmLogin = (event) => {
    // console.log("login")
    this.setState({ loginError: false })
    Axios({
      method: "post",
      url: "/api/user/login",
      data: {user: { email: this.state.email, password: this.state.password }},
    }).then(response => {
      const token = LoginToken.extractToken(response)
      LoginToken.saveToken(token)
      this.setState({ loggedIn: response.data.email, invalidText: null })
      if (this.props.history.length > 1) {
        this.props.history.go(-1)
      } else {
        this.props.history.replace("/user")
      }
    }).catch(error => {
      this.setState({ loginError: true, invalidText: "Incorrect email or password." })
    })
  }

  logout = (event) => {
    Axios({
      method: "delete",
      url: "/api/user/logout",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      LoginToken.saveToken(null)
      this.setState({ loggedIn: null })
    }).catch(error => {
      this.setState({ loginError: true })
    })
  }

  grab = (event) => {
    Axios({
      method: "get",
      url: "/api/user/info",
      headers: LoginToken.getHeaderWithToken()
    }).then(response => {
      this.setState({ loggedIn: response.data.email })
    }).catch(error => {

    })
  }

  inputKeyDown = (event) => {
    if (event.keyCode == 13) {
      this.confirmLogin(event)
    }
  }

  render () {
    return (
      <div>
        <Container maxWidth="sm">
          <Box mb={4}><Typography variant="h4">Login</Typography></Box>
          <Box mb={2}>
            <TextField fullWidth label="Email" value={this.state.email} onChange={this.emailChanged} error={this.state.loginError}
              onKeyDown={this.inputKeyDown}
            />
          </Box>
          <Box mb={4}>
            <TextField fullWidth label="Password" value={this.state.password} onChange={this.passwordChanged} type="password" error={this.state.loginError}
              helperText={this.state.invalidText}
              onKeyDown={this.inputKeyDown}
            />
          </Box>
          <Box>
            <Grid container justify="space-between">
              <Grid item>
                <Button variant="contained" color="primary" onClick={this.confirmLogin}>Login</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => this.props.history.push("/register")}>Register</Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    );
  }
}

export default Login
