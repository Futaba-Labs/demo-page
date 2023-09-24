import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import { NextPage } from 'next'
import { Image } from '@nextui-org/react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { getLightClientAddress, ChainStage } from '@futaba-lab/sdk'
import { LIGHT_CLIENT_ABI } from 'utils'

interface Props {
  visible: boolean
  handler: () => void
  closeHandler: () => void
}
const VerifyModal: NextPage<Props> = ({ visible, handler, closeHandler }) => {
  const [allowed, setAllowed] = useState(false)
  const { connectModalOpen, openConnectModal } = useConnectModal()
  const { chainModalOpen, openChainModal } = useChainModal()

  const { address } = useAccount()
  const { chain } = useNetwork()

  const lightClient = getLightClientAddress(ChainStage.TESTNET, chain?.id as number)

  const { data, refetch } = useContractRead({
    address: lightClient as `0x${string}`,
    abi: LIGHT_CLIENT_ABI,
    functionName: 'isWhitelisted',
    args: [address],
  })

  useEffect(() => {
    if (address) {
      setAllowed(false)
      refetch()
    }
  }, [address, chainModalOpen, connectModalOpen, refetch])

  useEffect(() => {
    if (data) {
      setAllowed(data as boolean)
    }
  }, [data])

  useEffect(() => {
    if (allowed) {
      closeHandler()
    }
  }, [allowed, closeHandler])

  return (
    <Modal aria-labelledby='modal-title'>
      <ModalHeader>
        <div>
          <Image height={100} src={'/images/futaba_512.png'} alt='Default Image' />
          Welcome to Futaba
        </div>
      </ModalHeader>
      <ModalBody>
        <>
          Futaba is currently in private beta.\nIf you would like to try the demo, please apply for private beta access.
          {!allowed && chain?.id == 80001 ? (
            <>Access is not allowed.\nPlease click the button below to apply for Private beta access.</>
          ) : (
            <>
              {openConnectModal && <Button onPress={openConnectModal}>Open Connect Modal</Button>}
              {openChainModal && <Button onPress={openChainModal}>Open Chain Modal</Button>}
            </>
          )}
        </>
      </ModalBody>
      <ModalFooter>
        <Button>Apply to private beta</Button>
      </ModalFooter>
    </Modal>
  )
}

export default VerifyModal
