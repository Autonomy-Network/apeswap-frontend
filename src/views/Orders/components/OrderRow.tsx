import { Order } from '@autonomylabs/limit-stop-orders'
import { formatUnits } from '@ethersproject/units'
import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Text, InfoIcon, TooltipBubble } from '@apeswapfinance/uikit'
import { Token } from '@apeswapfinance/sdk'
import { CurrencyLogo } from 'components/Logo'
import { AutoRow } from 'components/layout/Row'
import useAutonomyOrdersLib from 'hooks/useAutonomyOrdersLib'

const OrderRowWrapper = styled(Flex)`
  position: relative;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.white4};
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.dividerColor}`};
  justify-content: space-between;
  align-items: center;
  &:first-child {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  &:last-child {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border: none;
  }
`

const OrderColWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const OrderCol = styled(Flex)`
  min-width: 130px;
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0;
  }
`

const TooltipIcon = styled('div')`
  display: 'inline-block';
  position: absolute;
  top: 20px;
  right: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    position: relative;
    top: unset;
    right: unset;
  }
`

interface IOrderRowProps {
  order: Order
  tokenPair: {
    input: Token
    output: Token
  }
}

export default function OrderRow({ order, tokenPair }: IOrderRowProps) {
  const inputAmount = formatUnits(order.inputAmount, tokenPair.input?.decimals)
  const outputAmount = formatUnits(order.outputAmount, tokenPair.output?.decimals)

  const autonomyOrdersLib = useAutonomyOrdersLib()

  const handleCancel = React.useCallback(async () => {
    if (autonomyOrdersLib) {
      await autonomyOrdersLib.cancelOrder(order)
    }
  }, [autonomyOrdersLib, order])

  return (
    <OrderRowWrapper>
      <TooltipIcon>
        <TooltipBubble placement="topLeft" body={`Placed on: ${order.time}`} transformTip="translate(-15px, -100%)">
          <InfoIcon width="25px" />
        </TooltipBubble>
      </TooltipIcon>
      <OrderColWrapper>
        <OrderCol flexDirection="column">
          <Text fontSize="12px" color="gray">
            Swap
          </Text>
          <Text fontSize="16px" bold>
            {(+inputAmount).toFixed(6)}
          </Text>
          <AutoRow gap="5px" align="center">
            <CurrencyLogo currency={tokenPair.input} size="12px" />
            <Text fontSize="12px" color="#ffb300" style={{ opacity: 0.6 }}>
              {tokenPair.input?.symbol}
            </Text>
          </AutoRow>
        </OrderCol>
        <OrderCol flexDirection="column">
          <Text fontSize="12px" color="gray">
            For
          </Text>
          <Text fontSize="16px" bold>
            {(+outputAmount).toFixed(6)}
          </Text>
          <AutoRow gap="5px" align="center">
            <CurrencyLogo currency={tokenPair.output} size="12px" />
            <Text fontSize="12px" color="#ffb300" style={{ opacity: 0.6 }}>
              {tokenPair.output?.symbol}
            </Text>
          </AutoRow>
        </OrderCol>
      </OrderColWrapper>
      <OrderColWrapper>
        <OrderCol flexDirection="column">
          <Text fontSize="12px" color="gray">
            At
          </Text>
          <Text fontSize="16px" bold>
            {(+outputAmount / +inputAmount).toFixed(6)}
          </Text>
          <Text fontSize="12px" color="#ffb300" style={{ opacity: 0.6 }}>
            {tokenPair.input?.symbol} / {tokenPair.output?.symbol}
          </Text>
        </OrderCol>
        {order.status === 'open' && <Button onClick={handleCancel}>Cancel</Button>}
      </OrderColWrapper>
    </OrderRowWrapper>
  )
}
