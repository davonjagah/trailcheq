/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { TrailCheq, TrailCheqClient } from '../../contracts/TrailCheqClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<TrailCheqGetProductIdByIndex
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getProductIdByIndex"
  typedClient={typedClient}
  index={index}
/>
*/
type TrailCheqGetProductIdByIndexArgs = TrailCheq['methods']['getProductIdByIndex(uint64)string']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: TrailCheqClient
  index: TrailCheqGetProductIdByIndexArgs['index']
}

const TrailCheqGetProductIdByIndex = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getProductIdByIndex`)
    await props.typedClient.getProductIdByIndex(
      {
        index: props.index,
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

export default TrailCheqGetProductIdByIndex