import React, { Component } from 'react';
import Web3 from 'web3'
import Navbar from './Navbar'
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
    console.log(this.state.ethBalance)
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

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ethBalance: '0'
    }
  }

  render() {
    return (
      <div>
       <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="/"
                  rel="noopener noreferrer"
                >
                  {/* <img src={logo} className="App-logo" alt="logo" /> */}
                </a>
                <h1>This is where the swap occurs</h1>
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
