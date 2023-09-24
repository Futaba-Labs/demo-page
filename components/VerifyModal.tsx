import { Modal, Button, Text, Container } from '@nextui-org/react'
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
    <Modal
      animated={false}
      aria-labelledby='modal-title'
      open={visible}
      preventClose={true}
      blur={true}
      width='600px'
      autoMargin
      css={{ margin: '0 32px' }}
    >
      <Modal.Header>
        <Container>
          <Image height={100} src={'/images/futaba_512.png'} alt='Default Image' objectFit='scale-down' />
          <Text id='modal-title' size={24} weight={'normal'}>
            Welcome to Futaba
          </Text>
        </Container>
      </Modal.Header>
      <Modal.Body css={{ textAlign: 'center' }}>
        <>
          <Text size={18}>
            {
              'Futaba is currently in private beta.\nIf you would like to try the demo, please apply for private beta access.'
            }
          </Text>
          {!allowed && chain?.id == 80001 ? (
            <>
              <Text color='red'>
                {'Access is not allowed.\nPlease click the button below to apply for Private beta access.'}
              </Text>
            </>
          ) : (
            <>
              {openConnectModal && (
                <Button rounded shadow onPress={openConnectModal}>
                  Open Connect Modal
                </Button>
              )}
              {openChainModal && (
                <Button rounded shadow onPress={openChainModal}>
                  Open Chain Modal
                </Button>
              )}
            </>
          )}
        </>
      </Modal.Body>
      <Modal.Footer justify='center' css={{ paddingBottom: '$10' }}>
        <Button rounded shadow onPress={handler} css={{ width: '100%' }}>
          Apply to private beta
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default VerifyModal
