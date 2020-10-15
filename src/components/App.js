import React, { Component } from 'react';
import Web3 from 'web3'
import Token from '../abis/Token.json'
import CryptoDapp from '../abis/CryptoDapp.json'
import Navbar from './Navbar'
import Main from './Main'
// import logo from '../logo.png';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // console.log(this.state.account)

    const ethbalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethbalance })
    // console.log(this.state.ethBalance)

    // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

     // Load CryptoDapp
     const cryptoDappData = CryptoDapp.networks[networkId]
     if(cryptoDappData) {
       const cryptoDapp = new web3.eth.Contract(CryptoDapp.abi, cryptoDappData.address)
       this.setState({ cryptoDapp })
     } else {
       window.alert('CryptoDapp contract not deployed to detected network.')
     }

     this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  purchaseTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.cryptoDapp.methods.purchaseTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      cryptoDapp: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        purchaseTokens={this.purchaseTokens}
      />
    }
    return (
      <div>
       <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="/"
                  rel="noopener noreferrer"
                >
                  {/* <img src={logo} className="App-logo" alt="logo" /> */}
                </a>
                { content }
                <p>
                  {/* Edit <code>src/components/App.js</code> and save to reload. */}
                </p>
                <a
                  className="App-link"
                  href="/"
                  rel="noopener noreferrer"
                >
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
