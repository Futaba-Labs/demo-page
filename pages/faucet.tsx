import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Link } from '@nextui-org/react'
import Image from 'next/image'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { ContractTransaction, ethers } from 'ethers'
import { ChainKey, ChainStage } from '@futaba-lab/sdk'
import { parseUnits } from 'ethers/lib/utils'
import {
  DEPLOYMENT,
  ERC20_ABI,
  ERC721_ABI,
  NFT_ADDRESS,
  convertChainIdToName,
  getExploerUrl,
  getLocalStorege,
  getWallet,
  setLocalStorege,
  showToast,
} from 'utils'
import { Deployment } from 'types'
import { SubmitHandler, useForm } from 'react-hook-form'

type Transaction = {
  chain: number
  hash: string
}

type Inputs = {
  address: string
}

const Faucet: NextPage = () => {
  const storageKey = 'faucet'
  const [transactions, setTransactions] = useState<Transaction[]>([]),
    [loading, setLoading] = useState(false)
  const deployment = DEPLOYMENT[ChainStage.TESTNET] as Partial<Record<ChainKey, Deployment>>

  const { register, handleSubmit } = useForm<Inputs>()

  const sendTokens: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)

    return new Promise<void>((resolve, reject) => {
      try {
        const address = data.address
        const goerliWallet = getWallet(5)
        const arbitrumGoerliWallet = getWallet(421613)
        const optimismGoerliWallet = getWallet(420)

        const sampleNFT = new ethers.Contract(NFT_ADDRESS, ERC721_ABI, goerliWallet)
        const sampleTokenGoerli = new ethers.Contract(deployment[ChainKey.GOERLI]!.testToken, ERC20_ABI, goerliWallet)
        const sampleTokenArbitrum = new ethers.Contract(
          deployment[ChainKey.ARBITRUM_GOERLI]!.testToken,
          ERC20_ABI,
          arbitrumGoerliWallet,
        )
        const sampleTokenOptimism = new ethers.Contract(
          deployment[ChainKey.OPTIMISM_GOERLI]!.testToken,
          ERC20_ABI,
          optimismGoerliWallet,
        )

        goerliWallet.getTransactionCount().then((nonce) => {
          Promise.all([
            sampleNFT.safeMint(address, { nonce: nonce }),
            sampleTokenGoerli.mintTo(address, parseUnits('100'), { nonce: nonce + 1 }),
            sampleTokenArbitrum.mintTo(address, parseUnits('100')),
            sampleTokenOptimism.mintTo(address, parseUnits('100')),
          ])
            .then((res: ContractTransaction[]) => {
              const txs: Transaction[] = []
              for (const tx of res) {
                const chainId = tx.chainId
                const hash = tx.hash
                txs.push({ chain: chainId, hash: hash })
              }
              setTransactions(txs)
              setLocalStorege(storageKey, JSON.stringify(txs))
              setLoading(false)
            })
            .catch((err) => {
              console.log(err)
              showToast('error', 'Error')
              setLoading(false)
              reject()
              return
            })
        })

        return resolve()
      } catch (error) {
        showToast('error', 'Error')
        setLoading(false)
        reject()
        return
      }
    })
  }

  useEffect(() => {
    const data = getLocalStorege(storageKey)
    if (data) {
      setTransactions(JSON.parse(data))
    }
  }, [])

  return (
    <>
      <h2 className='text-3xl font-semibold my-6'>Sample Token Faucet</h2>
      <p className='text-lg font-normal mb-2'>
        {
          'You can mint here an ERC721 token that can be used for voting and an ERC20 token that can be used in the Balance query.'
        }
      </p>
      <p className='text-lg font-normal mb-8'>
        {
          'The ERC20 token is minted as a token for Goerli, Arbiturm Goerli and Optimism Goerli respectively. No transaction is required.'
        }
      </p>
      <form className='flex w-2/3 mb-6' onSubmit={handleSubmit(sendTokens)}>
        <Input
          placeholder='Your wallet address'
          fullWidth={true}
          className='mr-4'
          {...register('address')}
          isRequired
        />
        <Button type='submit' color='success' variant='flat' isLoading={loading} className='px-6'>
          {loading ? 'Sending' : 'Send me tokens'}
        </Button>
      </form>
      <h2 className='text-3xl font-semibold my-10'>Your Transactions</h2>
      {transactions.length > 0 ? (
        <Table aria-label='Example table with static content'>
          <TableHeader>
            <TableColumn>Chain</TableColumn>
            <TableColumn>Token Type</TableColumn>
            <TableColumn>Transaction hash</TableColumn>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => {
              const imageURL = `/images/chains/${transaction.chain.toString()}.svg`
              const alt = `Chain ${transaction.chain}`
              const chainId = transaction.chain
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex items-center'>
                      <Image src={imageURL} width={25} height={25} alt={alt} />
                      <p className='ml-1'>{convertChainIdToName(chainId)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{index === 0 ? 'ERC721' : 'ERC20'}</TableCell>
                  <TableCell>
                    <Link
                      isExternal
                      isBlock
                      showAnchorIcon
                      href={getExploerUrl(chainId) + 'tx/' + transaction.hash}
                      color='success'
                    >
                      {transaction.hash}
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <></>
      )}
    </>
  )
}

export default Faucet
