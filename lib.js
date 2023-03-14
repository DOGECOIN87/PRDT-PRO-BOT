import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import * as dotenv from "dotenv";
dotenv.config();

export const newBet = async ({
  network,
  bettingToken,
  targetToken,
  interval,
  amount,
  position,
}) => {
  try {
    const result = await axios.post(
      `https://api.prdt.finance/api/v1/prediction/bets`,
      {
        network,
        token: bettingToken,
        target: targetToken,
        interval,
        position,
        amount,
      },
      {
        headers: { cookie: global.authTokens },
      }
    );
  } catch (err) {
    console.log(err);
    return { status: false, message: "error on betting" };
  }

  return { status: true, message: "bet success" };
};

export const getBalances = async () => {
  const result = await axios.get(
    `https://api.prdt.finance/api/v1/prediction/balances/`,
    {
      headers: { cookie: global.authTokens },
    }
  );
  return result.data;
};

export const getBets = async ({ network, limit = 5 }) => {
  const result = await axios.get(
    `http://localhost:1337/api/v1/prediction/bets/${network}?limit=${limit}`,
    {
      headers: { cookie: global.authTokens },
    }
  );
  if (!result.data) return null;
  return result.data;
};

export const checkAuthenticate = async () => {
  try {
    const result = await axios.get(`http://localhost:1337/auth/authenticate`, {
      headers: { cookie: global.authTokens },
    });
    return result.status === 200;
  } catch (e) {
    return false;
  }
};

export const authenticate = async () => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.log("you need to enter privateKey on .env file");
    return false;
  }
  const rpc = "https://bsc-dataseed1.defibit.io";
  let _provider = new JsonRpcProvider(rpc);
  const wallet = new Wallet(privateKey, _provider);

  const message = await requestMessage({ address: wallet.address });
  const signature = await wallet.signMessage(message);
  const verification = await verify(message, signature);
  if (verification.status !== 200) return false;
  const authTokens = verification.headers["set-cookie"];
  global.authTokens = authTokens;
  return verification.status === 200;
};

const requestMessage = async ({ address }) => {
  const userData = {
    address,
    chain: "56",
    network: "evm",
  };
  const result = await axios.post(
    `http://localhost:1337/auth/request-message`,
    userData,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
    }
  );

  if (!result || !result.data) return null;

  return result.data.message;
};

const verify = (message, signature) => {
  const result = axios.post(
    `http://localhost:1337/auth/verify`,
    {
      message,
      signature,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
    }
  );

  return result;
};
