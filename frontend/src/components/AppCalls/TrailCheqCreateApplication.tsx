/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { TrailCheq, TrailCheqClient } from '../../contracts/TrailCheqClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<TrailCheqCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: TrailCheqClient
}

const TrailCheqCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {},
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

export default TrailCheqCreateApplication