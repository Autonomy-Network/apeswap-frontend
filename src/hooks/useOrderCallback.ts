import { parseEther } from '@ethersproject/units'
import { Trade, Token } from '@apeswapfinance/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getNativeWrappedAddress } from 'utils/addressHelper'
import truncateHash from 'utils/truncateHash'
import { useTransactionAdder } from '../state/transactions/hooks'
import { isAddress } from '../utils'
import useAutonomyOrdersLib from './useAutonomyOrdersLib'
import useENS from './ENS/useENS'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useOrderCallback(
  trade: Trade | undefined, // trade to execute, required
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  outputMinMaxAmount: string,
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const autonomyOrdersLib = useAutonomyOrdersLib()

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const { input, output } = trade.route
        const inputToken =
          input.symbol === 'ETH' ? getNativeWrappedAddress(chainId) : input instanceof Token ? input.address : ''
        const inputCurrencyDecimals = trade.inputAmount.currency.decimals || 18
        const inputAmount = parseEther(trade.inputAmount.toSignificant(6)).div(10 ** (18 - inputCurrencyDecimals))
        const outputToken =
          output.symbol === 'ETH' ? getNativeWrappedAddress(chainId) : output instanceof Token ? output.address : ''
        const outputCurrencyDecimals = trade?.outputAmount.currency.decimals || 18
        const outputAmount = parseEther(outputMinMaxAmount || '0').div(10 ** (18 - outputCurrencyDecimals))

        return autonomyOrdersLib
          .submitOrder('Limit', inputToken, inputAmount, outputToken, outputAmount, recipient, false)
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.getSymbol(chainId)
            const outputSymbol = trade.outputAmount.currency.getSymbol(chainId)
            // const inputAmount = trade.inputAmount.toSignificant(3)
            // const outputAmount = trade.outputAmount.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? truncateHash(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
              summary: withRecipient,
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, addTransaction])
}
