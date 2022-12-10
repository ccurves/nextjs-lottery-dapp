import React from "react";
import { ConnectButton } from "web3uikit";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="flex border-b-2 p-5 flex-row">
      <h1 className="py-4 px-4 font-bold text-lg md:text-3xl">Lottery Dapp</h1>
      <span className="ml-auto py-2 px-2">
        <ConnectButton />
      </span>
    </div>
  );
};

export default Header;
