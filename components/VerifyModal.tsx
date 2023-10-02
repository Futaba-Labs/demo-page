import { Modal, ModalHeader, ModalContent } from '@nextui-org/react'
import { NextPage } from 'next'
import { Image } from '@nextui-org/react'
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
              <h2 className='text-2xl font-semibold mb-4'>Coming soon 🌱</h2>
            </ModalHeader>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default VerifyModal
