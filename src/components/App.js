import React, { Component } from 'react';
import Web3 from 'web3'
import Token from '../abis/Token.json'
import CryptoDapp from '../abis/CryptoDapp.json'
import Navbar from './Navbar'
import Main from './Main'
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

    const ethbalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethbalance })

    // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState(tokenBalance);
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

  newMethod(tokenBalance) {
    this.setState({ tokenBalance: tokenBalance.toString() });
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

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.cryptoDapp.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.cryptoDapp.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
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
        sellTokens={this.sellTokens}
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
                </a>
                
                { content }
               
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
