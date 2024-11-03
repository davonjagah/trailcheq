/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { TrailCheq, TrailCheqClient } from '../../contracts/TrailCheqClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<TrailCheqVerifyProduct
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call verifyProduct"
  typedClient={typedClient}
  id={id}
/>
*/
type TrailCheqVerifyProductArgs = TrailCheq['methods']['verifyProduct(string)((string,string,string,string,string,bool,uint64,uint64),uint64)']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: TrailCheqClient
  id: TrailCheqVerifyProductArgs['id']
}

const TrailCheqVerifyProduct = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling verifyProduct`)
    await props.typedClient.verifyProduct(
      {
        id: props.id,
      },
      { sender },
    )
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default TrailCheqVerifyProduct