/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { TrailCheq, TrailCheqClient } from '../../contracts/TrailCheqClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<TrailCheqDeleteProduct
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call deleteProduct"
  typedClient={typedClient}
  id={id}
/>
*/
type TrailCheqDeleteProductArgs = TrailCheq['methods']['deleteProduct(string)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: TrailCheqClient
  id: TrailCheqDeleteProductArgs['id']
}

const TrailCheqDeleteProduct = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling deleteProduct`)
    await props.typedClient.deleteProduct(
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

export default TrailCheqDeleteProduct