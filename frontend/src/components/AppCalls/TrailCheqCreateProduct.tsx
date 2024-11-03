/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { TrailCheq, TrailCheqClient } from '../../contracts/TrailCheqClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<TrailCheqCreateProduct
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createProduct"
  typedClient={typedClient}
  id={id}
  name={name}
  description={description}
  category={category}
  imageURL={imageURL}
  owner={owner}
  created={created}
/>
*/
type TrailCheqCreateProductArgs = TrailCheq['methods']['createProduct(string,string,string,string,string,string,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: TrailCheqClient
  id: TrailCheqCreateProductArgs['id']
  name: TrailCheqCreateProductArgs['name']
  description: TrailCheqCreateProductArgs['description']
  category: TrailCheqCreateProductArgs['category']
  imageURL: TrailCheqCreateProductArgs['imageURL']
  owner: TrailCheqCreateProductArgs['owner']
  created: TrailCheqCreateProductArgs['created']
}

const TrailCheqCreateProduct = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createProduct`)
    await props.typedClient.createProduct(
      {
        id: props.id,
        name: props.name,
        description: props.description,
        category: props.category,
        imageURL: props.imageURL,
        owner: props.owner,
        created: props.created,
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

export default TrailCheqCreateProduct