import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { TrailCheqClient } from '../contracts/TrailCheqClient'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'


interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

// Function to calculate box reference for a product
const getProductBoxReference = (id: string)=> {
  return {
    name: new Uint8Array([...Buffer.from('product'), ...Buffer.from(id)])
  };
};

// Function to calculate box reference for NFT
const getNFTBoxReference = (id: string) => {
  return {
    name: new Uint8Array([...Buffer.from('nft'), ...Buffer.from(id)])
  };
};

// Function to calculate box reference for keys
const getKeysBoxReference = (index: number) => {
  return {
    name: new Uint8Array([...Buffer.from('keys'), ...Buffer.from(index.toString())])
  }
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contractInput, setContractInput] = useState<string>('')



  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  })

  const { enqueueSnackbar } = useSnackbar()
  const { signer, activeAddress } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const sendAppCall = async () => {
    const productId = "ueuueue";
    setLoading(true)

    // Please note, in typical production scenarios,
    // you wouldn't want to use deploy directly from your frontend.
    // Instead, you would deploy your contract on your backend and reference it by id.
    // Given the simplicity of the starter contract, we are deploying it on the frontend
    // for demonstration purposes.
    const appClient = new TrailCheqClient(
      {
        sender: { signer, addr: activeAddress } as TransactionSignerAccount,
        resolveBy: 'id',
        id: 728320277,
      },
      algodClient,
    )
    // await appClient.create.createApplication({}).catch((e: Error) => {
    //   enqueueSnackbar(`Error deploying the contract: ${e.message}`, { variant: 'error' })
    //   setLoading(false)
    //   return
    // })

    // const response = await appClient.createProduct(
    //   {
    //     id: productId,
    //     name: "hashshjhjswhjswhjsjswjjwsjwjwj",
    //     description: "hashshjhjswhjswhjsjswjjwsjwjwj",
    //     category: "hashshjhjswhjswhjsjswjjwsjwjwj",
    //     imageURL: "hashshjhjswhjswhjsjswjjwsjwjwj",
    //     owner: "hashshjhjswhjswhjsjswjjwsjwjwj",
    //     created: 0,
    //   },
      
    //   {
    //     sender,
    //     boxes: [
    //       { appIndex: 728320277, name: new Uint8Array([...Buffer.from('product'), ...Buffer.from(productId)]) },
    //       { appIndex: 728320277, name: new Uint8Array([...Buffer.from('nft'), ...Buffer.from(productId)]) },
    //       { appIndex: 728320277, name: new Uint8Array([...Buffer.from('keys'), ...Buffer.from('0')]) }
    //     ],
    //   }

    // )

    // console.log(response, "response")

    const appId = 728320277; // Your app ID

    // Helper function to properly encode box names
    const encodeBoxName = (prefix: string, value: string) => {
      const encoder = new TextEncoder();
      const prefixBytes = encoder.encode(prefix);
      const valueBytes = encoder.encode(value);
      
      // Ensure the combined result doesn't exceed 32 bytes
      const combinedLength = prefixBytes.length + valueBytes.length;
      if (combinedLength > 32) {
          throw new Error(`Box name exceeds 32 bytes: ${combinedLength}`);
      }
  
      // Combine the prefix and value bytes
      const combined = new Uint8Array(combinedLength);
      combined.set(prefixBytes, 0);
      combined.set(valueBytes, prefixBytes.length);
  
      return combined;
  };

    // Log the box names for debugging
    const productBoxName = encodeBoxName('product', productId);
    const nftBoxName = encodeBoxName('nft', productId);
    const keysBoxName = encodeBoxName('keys', '0');
    
    console.log('Box Names:', {
      product: Array.from(productBoxName).map(b => b.toString(16).padStart(2, '0')).join(''),
      nft: Array.from(nftBoxName).map(b => b.toString(16).padStart(2, '0')).join(''),
      keys: Array.from(keysBoxName).map(b => b.toString(16).padStart(2, '0')).join('')
    });

    const response = await appClient.createProduct(
      {
        id: productId,
        name: "hashshjhjswhjswhjsjswjjwsjwjwj",
        description: "hashshjhjswhjswhjsjswjjwsjwjwj",
        category: "hashshjhjswhjswhjsjswjjwsjwjwj",
        imageURL: "hashshjhjswhjswhjsjswjjwsjwjwj",
        owner: "hashshjhjswhjswhjsjswjjwsjwjwj",
        created: BigInt(0), // Make sure to use BigInt
      },
      {
        sender,
        boxes: [
          { appIndex: appId, name: productBoxName },
          { appIndex: appId, name: nftBoxName },
          { appIndex: appId, name: keysBoxName }
        ],
        suggestedParams: {
          flatFee: true,
          fee: 1000,
          extraBoxRefs: 3
        }
      }
    );

    console.log('Product created successfully:', response);
    // const response = await appClient.hello({ name: contractInput }).catch((e: Error) => {
    //   enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
    //   setLoading(false)
    //   return
    // })

    enqueueSnackbar(`Response from the contract: ${response?.return}`, { variant: 'success' })
    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Say hello to your Algorand smart contract</h3>
        <br />
        <input
          type="text"
          placeholder="Provide input to hello function"
          className="input input-bordered w-full"
          value={contractInput}
          onChange={(e) => {
            setContractInput(e.target.value)
          }}
        />
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
          <button className={`btn`} onClick={sendAppCall}>
            {loading ? <span className="loading loading-spinner" /> : 'Send application call'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
