// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

// Interface for ERC20 token
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract taifeiBazaar {
    // Constants
    address public constant SWAP_ROUTER = 0x5615CDAb10dc425a742d643d949a7F474C01abc4;
    address public constant USDC = 0xcebA9300f2b948710d2653dD7B07f33A8B32118C; 
    uint24 public constant POOL_FEE = 3000;
    
    // Address of the contract owner
    address public owner;
    
    event SwapExecuted(uint256 usdcAmount, uint256 wethReceived);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    function swap(uint256 usdcAmount, address _tokenOut, address _userWallet) external returns (uint256 wethAmount) {
        // Transfer USDC from user to this contract
        IERC20(USDC).transferFrom(_userWallet, address(this), usdcAmount);
        
        // Approve the router to spend USDC
        IERC20(USDC).approve(SWAP_ROUTER, usdcAmount);
        
        // Set up the params for the swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: USDC,
            tokenOut: _tokenOut,
            fee: POOL_FEE,
            recipient:_userWallet, 
            amountIn: usdcAmount,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0 
        });
        
        // Execute the swap
        wethAmount = ISwapRouter(SWAP_ROUTER).exactInputSingle(params);
        
        emit SwapExecuted(usdcAmount, wethAmount);
        return wethAmount;
    }
    
 

    function recoverTokens(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner, balance);
    }
    

    function recoverETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}