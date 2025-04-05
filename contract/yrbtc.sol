// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract yRBTCToken is ERC20, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Token to be staked (specified ERC20 token)
    IERC20 public immutable stakingToken;
    
    // Address of the staking token
    address public constant STAKING_TOKEN_ADDRESS = 0x542fDA317318eBF1d3DEAf76E0b632741A7e677d;
    
    // Reward rate (tokens per second)
    uint256 public rewardRate;
    
    // Last time rewards were updated
    uint256 public lastUpdateTime;
    
    // Reward per token stored
    uint256 public rewardPerTokenStored;
    
    // Total amount of tokens staked in the contract
    uint256 public totalStaked;
    
    // Maximum supply cap for yRBTC
    uint256 public immutable maxSupply;
    
    // User staking data
    struct UserInfo {
        uint256 stakedAmount;         // Amount of tokens staked by user
        uint256 rewardDebt;           // Reward debt
        uint256 rewards;              // Pending rewards
        uint256 lastStakeTime;        // Last time user staked
    }
    
    // Mapping of user address to their staking information
    mapping(address => UserInfo) public userInfo;
    
    // Mapping of user address to rewards per token paid
    mapping(address => uint256) public userRewardPerTokenPaid;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _maxSupply,
        uint256 _rewardRate,
        address _initialDistribution
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_initialSupply <= _maxSupply, "Initial supply exceeds max supply");
        require(_initialDistribution != address(0), "Invalid initial distribution address");
        
        stakingToken = IERC20(STAKING_TOKEN_ADDRESS);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
        maxSupply = _maxSupply;
        
        // Mint initial supply to the specified address
        _mint(_initialDistribution, _initialSupply);
    }

    /**
     * @dev Update reward variables
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            userInfo[account].rewards = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        return rewardPerTokenStored.add(
            block.timestamp.sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(totalStaked)
        );
    }

    function earned(address account) public view returns (uint256) {
        return userInfo[account].stakedAmount
            .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
            .div(1e18)
            .add(userInfo[account].rewards);
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        // Update user staking info
        UserInfo storage user = userInfo[msg.sender];
        user.stakedAmount = user.stakedAmount.add(amount);
        user.lastStakeTime = block.timestamp;
        
        // Update total staked amount
        totalStaked = totalStaked.add(amount);
        
        // Transfer tokens from user to this contract
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        require(amount > 0, "Cannot withdraw 0");
        require(user.stakedAmount >= amount, "Withdraw amount exceeds staked amount");
        
        // Update user staking info
        user.stakedAmount = user.stakedAmount.sub(amount);
        
        // Update total staked amount
        totalStaked = totalStaked.sub(amount);
        
        // Transfer tokens from contract to user
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 reward = user.rewards;
        
        if (reward > 0) {
            user.rewards = 0;
            
            // Check if minting would exceed max supply
            require(totalSupply().add(reward) <= maxSupply, "Reward exceeds max supply cap");
            
            // Mint yRBTC tokens directly to the user
            _mint(msg.sender, reward);
            
            emit RewardPaid(msg.sender, reward);
        }
    }

    function _claimReward(address user) internal {
        UserInfo storage userStruct = userInfo[user];
        uint256 reward = userStruct.rewards;
        
        if (reward > 0) {
            userStruct.rewards = 0;
            
            // Check if minting would exceed max supply
            require(totalSupply().add(reward) <= maxSupply, "Reward exceeds max supply cap");
            
            // Mint yRBTC tokens directly to the user
            _mint(user, reward);
            
            emit RewardPaid(user, reward);
        }
    }

    function exit() external nonReentrant updateReward(msg.sender) {
        // Handle withdrawal
        uint256 amount = userInfo[msg.sender].stakedAmount;
        if (amount > 0) {
            userInfo[msg.sender].stakedAmount = 0;
            totalStaked = totalStaked.sub(amount);
            stakingToken.safeTransfer(msg.sender, amount);
            emit Withdrawn(msg.sender, amount);
        }
        
        // Handle reward claiming using internal function
        _claimReward(msg.sender);
    }
    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }
  
    function getUserInfo(address account) external view returns (
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 lastStakeTime
    ) {
        UserInfo memory user = userInfo[account];
        return (
            user.stakedAmount,
            earned(account),
            user.lastStakeTime
        );
    }
    
    function mintYRBTC(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply().add(amount) <= maxSupply, "Minting would exceed max supply cap");
        _mint(to, amount);
    }

    function recoverERC20(address token, uint256 amount) external onlyOwner {
        require(token != STAKING_TOKEN_ADDRESS, "Cannot recover staked tokens");
        require(token != address(this), "Cannot recover yRBTC tokens");
        IERC20(token).safeTransfer(owner(), amount);
    }
}