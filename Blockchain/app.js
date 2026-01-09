let provider, signer, contract;

async function connect() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );

  document.getElementById("status").innerText = "已連線";
  document.getElementById("account").innerText = await signer.getAddress();

  updateBalance();
}

async function updateBalance() {
  const balance = await contract.getBalance();
  document.getElementById("balance").innerText =
    ethers.formatEther(balance) + " ETH";
}

async function claim() {
  try {
    const tx = await contract.claim();
    log("交易送出...");
    await tx.wait();
    log("🎉 搶紅包成功！");
    updateBalance();
  } catch (e) {
    log("x " + e.message);
  }
}

function log(msg) {
  document.getElementById("log").textContent += "\n> " + msg;
}
