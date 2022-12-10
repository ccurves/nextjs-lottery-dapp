import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { ethers, BigNumber, ContractTransaction } from "ethers";
import { Bell, useNotification } from "web3uikit";

type Props = {};

const EnterButton = (props: Props) => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const addresses: ContractAddresses = contractAddresses;
  const chainId: string = parseInt(chainIdHex!).toString();
  const lotteryAddress = chainId in addresses ? addresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: enterLottery,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress!,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress!,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress!,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (
      (await getEntranceFee()) as BigNumber
    ).toString();
    const numPlayersFromCall = (
      (await getNumberOfPlayers()) as BigNumber
    ).toString();
    const recentWinnerFromCall = (await getRecentWinner()) as string;
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  const handleSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    handleNotifiction();
    updateUI();
  };

  const handleNotifiction = () => {
    dispatch({
      type: "info",
      message: "Transaction Completed!",
      title: "Tx Notification",
      position: "topR",
      icon: <Bell fontSize={20} />,
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="p-5">
      <h3 className="font-semibold	">A Decentralized and autonomous lottery</h3>
      {lotteryAddress ? (
        <div>
          <button
            className=" bg-zinc-700 hover:bg-zinc-900 rounded text-white py-2 px-2 ml-auto mb-4 mt-2"
            onClick={async () => {
              await enterLottery({
                onError(error) {
                  console.log(error);
                },
                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <span className="animate-spin spinner-border h-4 w-4 border-b-2 rounded-full px-2"></span>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div>
            Lottery Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Number of Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No lottery address found</div>
      )}
    </div>
  );
};

export default EnterButton;
