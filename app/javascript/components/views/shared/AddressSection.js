import React from "react"
import PropTypes from "prop-types"

import Axios from 'axios'
import LoginToken from './LoginToken'
import { Box, Grid, TextField, Typography, FormControl, ThemeProvider, createMuiTheme, Link, CardActions, Collapse } from '@material-ui/core'
import { Button, Select, InputLabel, MenuItem, Card, CircularProgress, CardActionArea, CardContent, withStyles } from '@material-ui/core'
import { FormHelperText, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { green, red, blue, grey } from '@material-ui/core/colors'
import { AddCircle, CheckCircle, FastForward } from '@material-ui/icons'

const addressButtonTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[500]
    },
    secondary: {
      main: red[500]
    },
  },
})
const cancelButtonTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[500]
    }
  }
})

const style = theme => ({
  fullHeight: {
    height: "100%"
  },
  centreText: {
    textAlign: "center"
  },
  linkStyle: {
    color: blue[500],
    cursor: "pointer"
  },
  selectedCard: {
    borderColor: green[500]
  }
})

class AddressSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addresses: null,
      selectedAddresses: this.DEFAULT_EMPTY_ADDRESS(),
      provinces: null,
      editingAddress: false,
      formErrors: {
        street_no: false,
        city: false,
        province_id: false,
        postal_code: false,
      },
      submittingAddress: false,
      deleteDialog: false,
      addressSubmittedAlert: false,
      successMsg: "",
      addressSubmittedErrorAlert: false,
    }
  }

  componentDidMount() {
    this.fetchProvinces()
    this.fetchAddress()
  }

  DEFAULT_EMPTY_ADDRESS = () => {
    return {
      street_no: "",
      apt_no: "",
      city: "",
      postal_code: "",
      province_id: "",
    }
  }

  fetchProvinces = () => {
    Axios({
      method: "get",
      url: "/api/provinces",
      headers: LoginToken.getHeaderWithToken(),
    }).then(response => {
      this.setState({ provinces: response.data })
    })
  }

  fetchAddress = () => {
    Axios({
      method: "get",
      url: "/api/user/addresses",
      headers: LoginToken.getHeaderWithToken(),
    }).then(response => {
      this.setState({ addresses: response.data.addresses })
    })
  }

  addressCardClick = (address) => (event) => {
    this.setState({ selectedAddresses: address })
  }

  editLinkClick = (address) => (event) => {
    this.setState({ selectedAddresses: address, editingAddress: true })
  }

  newLinkClick = (event) => {
    this.setState({ selectedAddresses: this.DEFAULT_EMPTY_ADDRESS(), editingAddress: true })
  }

  inputChanged = (fieldName) => (event) => {
    this.state.selectedAddresses[fieldName] = event.target.value
    this.state.formErrors[fieldName] = false
    this.setState({
      selectedAddresses: this.state.selectedAddresses,
      formErrors: this.state.formErrors
    })
  }

  cancelButtonClick = (event) => {
    this.setState({ editingAddress: false })
  }

  submitButtonClick = (event) => {
    if (this.checkAdressFields()) {
      this.setState({ submittingAddress: true })
      this.submitAddress()
    }
  }

  checkAdressFields = () => {
    let result = true
    if (!this.state.selectedAddresses.street_no) {
      result = false
      this.state.formErrors.street_no = true
    }
    if (!this.state.selectedAddresses.city) {
      result = false
      this.state.formErrors.city = true
    }
    if (!this.state.selectedAddresses.province_id) {
      result = false
      this.state.formErrors.province_id = true
    }
    if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(this.state.selectedAddresses.postal_code)) {
      result = false
      this.state.formErrors.postal_code = true
    }
    this.setState({ formErrors: this.state.formErrors })
    return result
  }

  submitAddress = () => {
    this.setState({ submittingAddress: true })
    if (this.state.selectedAddresses.id) {
      Axios({
        method: "post",
        url: `api/user/addresses/edit/${this.state.selectedAddresses.id}`,
        data: this.state.selectedAddresses,
        headers: LoginToken.getHeaderWithToken(),
      }).then(res => {
        this.setState({
          selectedAddresses: res.data,
          submittingAddress: false,
          editingAddress: false,
          addressSubmittedAlert: true,
          successMsg: "updated",
        })
        this.fetchAddress()
      }).catch(error => {
        this.setState({ submittingAddress: false, addressSubmittedErrorAlert: true })
        console.error("Error submitting address.")
      })
    } else {
      Axios({
        method: "post",
        url: `api/user/addresses/new`,
        data: this.state.selectedAddresses,
        headers: LoginToken.getHeaderWithToken(),
      }).then(res => {
        this.setState({
          selectedAddresses: res.data,
          submittingAddress: false,
          editingAddress: false,
          addressSubmittedAlert: true,
          successMsg: "created",
        })
        this.fetchAddress()
      }).catch(error => {
        this.setState({ submittingAddress: false, addressSubmittedErrorAlert: true })
        console.error("Error submitting address.")
      })
    }
  }

  deleteButtonClick = (event) => {
    this.setState({ deleteDialog: true })
  }

  deleteAddress = () => {
    if (!this.state.selectedAddresses.id) {
      return
    }
    this.setState({ submittingAddress: true })
    Axios({
      method: "delete",
      url: `api/user/addresses/del/${this.state.selectedAddresses.id}`,
      headers: LoginToken.getHeaderWithToken(),
    }).then(res => {
      this.setState({
        selectedAddresses: this.DEFAULT_EMPTY_ADDRESS(),
        submittingAddress: false,
        editingAddress: false,
        addressSubmittedAlert: true,
        successMsg: "deleted",
      })
      this.fetchAddress()
    }).catch(er => {
      this.setState({ submittingAddress: false, addressSubmittedErrorAlert: true })
      console.error("Error occurs when deleting")
    })
  }

  deleteDialogClick = (confirm) => (event) => {
    if (confirm) {
      this.deleteAddress()
    }
    this.setState({ deleteDialog: false })
  }

  onAddressSubmittedAlert = () => {
    this.setState({ addressSubmittedAlert: false })
  }

  onAddressSubmittedErrorAlert = () => {
    this.setState({ addressSubmittedErrorAlert: false })
  }


  render () {
    const classes = this.props.classes
    let addressesCard = <Grid item><CircularProgress /></Grid>

    if (this.state.addresses != null) {
      addressesCard = this.state.addresses.map(ad => {
        let adCopy = {}
        Object.keys(ad).map(key => {
          adCopy[key] = ad[key] || ""
        })
        const selected = this.state.selectedAddresses.id == ad.id
        return (
          <Grid item md={3} key={ad.id}>
            <Card variant="outlined" className={classes.fullHeight} className={selected && !this.props.disableSelect ? classes.selectedCard : ""}>
                {this.props.disableSelect ? (
                  <CardContent className={classes.fullHeight}>
                  <Box>
                    <Box mb={1}>
                      <Typography variant="body1">
                        {ad.street_no}{ad.apt_no ? " " + ad.apt_no : ""}, {ad.city}, {ad.province.abbr} {ad.postal_code}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1"><Link className={classes.linkStyle} onClick={this.editLinkClick(adCopy)}>Edit</Link></Typography>
                    </Box>
                  </Box>
                </CardContent>
                ) : (
                  <CardActionArea onClick={this.addressCardClick(adCopy)} className={classes.fullHeight}>
                  <CardContent className={classes.fullHeight}>
                  <Box>
                    <Box mb={1}>
                      <Typography variant="body1">
                        {ad.street_no}{ad.apt_no ? " " + ad.apt_no : ""}, {ad.city}, {ad.province.abbr} {ad.postal_code}
                      </Typography>
                    </Box>
                    <Grid container justify="space-between">
                      <Grid item><Typography variant="body1"><Link style={{color: blue[500]}} onClick={this.editLinkClick(adCopy)}>Edit</Link></Typography></Grid>
                      { selected ? <Grid item><CheckCircle style={{color: green[500]}} /></Grid> : "" }
                    </Grid>
                  </Box>
                </CardContent>
                </CardActionArea>
                )}
            </Card>
          </Grid>
        )
      })
    }

    let provinceItems = null
    if (this.state.provinces != null) {
      provinceItems = this.state.provinces.map(item => {
        return (
          <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
        )
      })
    }

    const newAddressCard = (
      <Grid item md={3}>
        <Card variant="outlined" className={classes.fullHeight}>
          <CardActionArea onClick={this.newLinkClick} className={classes.fullHeight}>
            <CardContent>
              <Box>
                <Box mb={1} className={classes.centreText}>
                  <AddCircle style={{fontSize: 20}} />
                </Box>
                <Box className={classes.centreText}>
                  <Typography variant="h5">New Address</Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )

    return (
      <div>
        <Box p={2}>
          <Box mb={4}>
            <Grid container spacing={2}>
              { addressesCard }
              { this.state.addresses != null ? newAddressCard : null }
            </Grid>
          </Box>
          <Collapse in={this.state.editingAddress}>
            <Box mb={2}>
              <Typography variant="h5">{ this.state.selectedAddresses.id ? "Edit Address" : "New Address" }</Typography>
            </Box>
            <Box mb={1}>
              <TextField fullWidth label="Street"
              value={this.state.selectedAddresses.street_no}
              onChange={this.inputChanged("street_no")}
              InputLabelProps={{ shrink: Boolean(this.state.selectedAddresses.street_no) }}
              error={this.state.formErrors.street_no}
              helperText={this.state.formErrors.street_no ? "Please enter a street address" : ""}
              />
            </Box>
            <Box mb={1}>
              <TextField fullWidth label="Apartment"
              value={this.state.selectedAddresses.apt_no}
              onChange={this.inputChanged("apt_no")}
              InputLabelProps={{ shrink: Boolean(this.state.selectedAddresses.apt_no) }}
              helperText="*Optional"
              />
            </Box>
            <Box mb={1}>
              <Grid container spacing={2} >
                <Grid item sm={4} xs={12}>
                  <TextField fullWidth label="City"
                  value={this.state.selectedAddresses.city}
                  onChange={this.inputChanged("city")}
                  InputLabelProps={{ shrink: Boolean(this.state.selectedAddresses.city) }}
                  error={this.state.formErrors.city}
                  helperText={this.state.formErrors.city ? "Please enter a city" : ""}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth className="category-select" error={this.state.formErrors.province_id}>
                    <InputLabel>Province</InputLabel>
                    <Select value={this.state.selectedAddresses.province_id} onChange={this.inputChanged("province_id")}>
                      {provinceItems}
                    </Select>
                    <FormHelperText>{this.state.formErrors.province_id ? "Please select a province" : ""}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField fullWidth label="Postal Code"
                  value={this.state.selectedAddresses.postal_code}
                  onChange={this.inputChanged("postal_code")}
                  InputLabelProps={{ shrink: Boolean(this.state.selectedAddresses.postal_code) }}
                  error={this.state.formErrors.postal_code}
                  helperText={this.state.formErrors.postal_code ? "Please enter a valid postal code" : ""}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <ThemeProvider theme={addressButtonTheme}>
              <Grid container spacing={4} justify="space-between">
                <Grid item><Button variant="contained" color="secondary" onClick={this.deleteButtonClick}
                  disabled={this.state.submittingAddress || !this.state.selectedAddresses.id}>Delete</Button></Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <ThemeProvider theme={cancelButtonTheme}>
                      <Button variant="contained" color="primary" onClick={this.cancelButtonClick} disabled={this.state.submittingAddress}>Cancel</Button>
                      </ThemeProvider>
                    </Grid>
                    <Grid item><Button variant="contained" color="primary" onClick={this.submitButtonClick} disabled={this.state.submittingAddress}>Submit</Button></Grid>
                  </Grid>
                </Grid>
              </Grid>
              </ThemeProvider>
            </Box>
          </Collapse>
          <Dialog open={this.state.deleteDialog}>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogContent><DialogContentText>Are you sure you would like do delete this address?</DialogContentText></DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.deleteDialogClick(false)}>No</Button>
              <Button color="primary" onClick={this.deleteDialogClick(true)}>Yes</Button>
            </DialogActions>
          </Dialog>
          <Snackbar open={this.state.addressSubmittedAlert} autoHideDuration={7000} onClose={this.onAddressSubmittedAlert}>
            <Alert elevation={6} variant="filled" onClose={this.onAddressSubmittedAlert} severity="success">
              Address sucessfully { this.state.successMsg }.
            </Alert>
          </Snackbar>
          <Snackbar open={this.state.addressSubmittedErrorAlert} autoHideDuration={7000} onClose={this.onAddressSubmittedErrorAlert}>
            <Alert elevation={6} variant="filled" onClose={this.onAddressSubmittedErrorAlert} severity="error">
              Something went wrong while processing address. Please try again.
            </Alert>
          </Snackbar>
        </Box>
      </div>
    );
  }
}

export default withStyles(style)(AddressSection)
