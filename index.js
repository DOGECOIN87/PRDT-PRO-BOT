import { newBet, getBalances, getBets, authenticate } from "./lib.js";

/*
example newBet function

network can be "polygon", "bsc"
bettingToken can be "matic", "bnb", "usdt"
targetToken can be "btc", "eth", "matic", "ada", "doge", "sol"
interval is in seconds, 180 is 3 minutes
amount is betting amount in decimals. no need to convert to wei
position, 0 is up 1 is down

newBet({
    network: "polygon",
    bettingToken: "usdt",
    targetToken: "btc",
    interval: 180,
    amount: 15,
    position: 0,
  })
*/

// you can enter your strategy here, call newBet only once or in an infinite loop
// until you reach a defined logic
const betStrategyLoop = async () => {
  const betRequestResult = await newBet({
    network: "polygon",
    bettingToken: "matic",
    targetToken: "btc",
    interval: 180,
    amount: 6.1,
    position: 1,
  });

  console.log(betRequestResult);
};

const main = async () => {
  const isAuth = await authenticate();
  if (!isAuth)
    return console.log("an error occured on authentication, please try again");
  else console.log("authenticated, starting the bot...");

  betStrategyLoop();
};

main();
