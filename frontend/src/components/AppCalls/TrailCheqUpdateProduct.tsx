/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { TrailCheq, TrailCheqClient } from '../../contracts/TrailCheqClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<TrailCheqUpdateProduct
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call updateProduct"
  typedClient={typedClient}
  id={id}
  name={name}
  description={description}
  updated={updated}
/>
*/
type TrailCheqUpdateProductArgs = TrailCheq['methods']['updateProduct(string,string,string,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: TrailCheqClient
  id: TrailCheqUpdateProductArgs['id']
  name: TrailCheqUpdateProductArgs['name']
  description: TrailCheqUpdateProductArgs['description']
  updated: TrailCheqUpdateProductArgs['updated']
}

const TrailCheqUpdateProduct = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling updateProduct`)
    await props.typedClient.updateProduct(
      {
        id: props.id,
        name: props.name,
        description: props.description,
        updated: props.updated,
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

export default TrailCheqUpdateProduct