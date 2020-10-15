const Token = artifacts.require('Token')
const CryptoDapp = artifacts.require('CryptoDapp')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('CryptoDapp', ([deployer, investor]) => {
  let token, cryptoDapp

  before(async () => {
    token = await Token.new()
    cryptoDapp = await CryptoDapp.new(token.address)
    // Transfer all tokens to CryptoDapp (1 million)
    await token.transfer(cryptoDapp.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('CryptoDapp deployment', async () => {
    it('contract has a name', async () => {
      const name = await cryptoDapp.name()
      assert.equal(name, 'CryptoDapp Instant Exchange')
    })

    it('contract has tokens', async () => {
      let balance = await token.balanceOf(cryptoDapp.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('purchaseTokens()', async () => {
    let result

    before(async () => {
      // Purchase tokens before each example
      result = await cryptoDapp.purchaseTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
    })

    it('Allows user to instantly purchase tokens from CryptoDapp for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('100'))

      // Check CryptoDapp balance after purchase
      let cryptoDappBalance
      cryptoDappBalance = await token.balanceOf(cryptoDapp.address)
      assert.equal(cryptoDappBalance.toString(), tokens('999900'))
      cryptoDappBalance = await web3.eth.getBalance(cryptoDapp.address)
      assert.equal(cryptoDappBalance.toString(), web3.utils.toWei('1', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

  describe('sellTokens()', async () => {
    let result

    before(async () => {
      // Investor must approve tokens before the purchase
      await token.approve(cryptoDapp.address, tokens('100'), { from: investor })
      // Investor sells tokens
      result = await cryptoDapp.sellTokens(tokens('100'), { from: investor })
    })

    it('Allows user to instantly sell tokens to cryptoDapp for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))

      // Check cryptoDapp balance after purchase
      let cryptoDappBalance
      cryptoDappBalance = await token.balanceOf(cryptoDapp.address)
      assert.equal(cryptoDappBalance.toString(), tokens('1000000'))
      cryptoDappBalance = await web3.eth.getBalance(cryptoDapp.address)
      assert.equal(cryptoDappBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE: investor can't sell more tokens than they have
      await cryptoDapp.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    })
  })

})