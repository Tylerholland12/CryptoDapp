pragma solidity ^0.5.0;

// import token so contracts can interact with each other
import "./Token.sol";

contract CryptoDapp {
  string public name = "CryptoDapp Instant Exchange";
  Token public token;
  uint public rate = 100;

  event TokenPurchased(
      address account,
      address token,
      uint amount,
      uint rate
  );

  constructor(Token _token) public {
    //   interactive token to use
      token = _token;
  }

  function purchaseTokens() public payable {
    //   amount of eth * redemption rate
      uint tokenAmount = msg.value * rate;
      
    //   make sure user has suffecient funds
      require(token.balanceOf(address(this)) >= tokenAmount);
    //   trasfer tokens to users
      token.transfer(msg.sender, tokenAmount);

    //   emit an event
    emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
      require(token.balanceOf(msg.sender) >= _amount);
    //   calc amount of ether to redeem
      uint etherAmount = _amount / rate;

      token.transferFrom(msg.sender, address(this), _amount);
      msg.sender.transfer(etherAmount);

  }
}
