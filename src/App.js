import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState(null);
  const [contractData, setContractData] = useState('');
  const [newData, setNewData] = useState('');

  // ABI & Contract Address untuk berinteraksi dengan smart contract
  const contractABI = [
    // Replace with your smart contract ABI
    "function readData() view returns (string)",
    "function writeData(string _data)"
  ];
  const contractAddress = '0xYourSmartContractAddressHere'; // Ganti dengan address kontrak

  // Connect Wallet (Metamask)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert('Metamask not detected');
    }
  };

  // Menampilkan saldo zkSync (ETH Testnet)
  const getBalance = async () => {
    if (provider && walletAddress) {
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  // Membaca data dari smart contract
  const readContract = async () => {
    if (provider) {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const data = await contractInstance.readData();
      setContractData(data);
      setContract(contractInstance);
    }
  };

  // Menulis data ke smart contract
  const writeContract = async () => {
    if (contract) {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      await contractWithSigner.writeData(newData);
      alert('Data written to contract!');
    }
  };

  useEffect(() => {
    if (walletAddress) {
      getBalance();
    }
  }, [walletAddress, provider]);

  return (
    <div className="App">
      <h1>zkSync DApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}

      <hr />

      <div>
        <h2>Smart Contract Interaction</h2>
        <button onClick={readContract}>Read from Contract</button>
        {contractData && <p>Data from contract: {contractData}</p>}

        <div>
          <input
            type="text"
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            placeholder="New data"
          />
          <button onClick={writeContract}>Write to Contract</button>
        </div>
      </div>
    </div>
  );
}

export default App;
