import { Modal, ModalHeader, ModalBody, ModalContent, Button } from '@nextui-org/react'
import { NextPage } from 'next'
import { Image } from '@nextui-org/react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { useEffect, useMemo } from 'react'
import { LIGHT_CLIENT_ABI } from 'utils'
import { useLightClient } from 'hooks'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}
const VerifyModal: NextPage<Props> = ({ isOpen, onOpenChange, onClose }) => {
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()

  const { address } = useAccount()
  const { chain } = useNetwork()

  const lightClient = useLightClient()

  const { data, refetch } = useContractRead({
    address: lightClient as `0x${string}`,
    abi: LIGHT_CLIENT_ABI,
    functionName: 'isWhitelisted',
    args: [address],
  })

  const allowed = useMemo(() => {
    if (data) {
      return data as boolean
    }
    return false
  }, [data])

  useEffect(() => {
    if (address && lightClient) {
      refetch()
    }
  }, [address, refetch, lightClient, chain])

  useEffect(() => {
    if (allowed) {
      onClose()
    }
  }, [allowed, onClose])

  return (
    <Modal
      aria-labelledby='modal-title'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop='blur'
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col place-items-center'>
              <Image height={100} width={150} src={'/images/futaba_512.png'} alt='Default Image' />
              <h2 className='text-2xl font-semibold mb-4'>Welcome to Futaba 🌱</h2>
            </ModalHeader>
            <ModalBody>
              <>
                <p className='text-md font-normal text-center'>{'Futaba is currently in private beta.'}</p>
                <p className='text-md font-normal text-center'>
                  {'If you would like to try the demo, please apply for private beta access.'}
                </p>
                {!allowed && chain?.id == 80001 ? (
                  <p className='text-md font-normal mb-3 text-center'>
                    Access is not allowed. Please click the button below to apply for Private beta access.
                  </p>
                ) : (
                  <div className='mb-1'>
                    {openConnectModal && (
                      <Button onPress={openConnectModal} color='success' fullWidth={true}>
                        Wallet connect
                      </Button>
                    )}
                    {openChainModal && (
                      <Button onPress={openChainModal} color='success' fullWidth={true}>
                        Change chain
                      </Button>
                    )}
                  </div>
                )}
                <Button className='mb-3' color='success'>
                  Apply to private beta
                </Button>
              </>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default VerifyModal
