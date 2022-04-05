import { OrderStatus } from '@autonomylabs/limit-stop-orders'
import { getAddress } from '@ethersproject/address'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { useMatchBreakpoints, Tabs, Tab } from '@apeswapfinance/uikit'

import { AppBody } from '../../../components/App'
import { useAllTokens } from '../../../hooks/Tokens'
import useAutonomyOrdersLib from '../../../hooks/useAutonomyOrdersLib'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../styles'
import OrderRow from './OrderRow'

const OrderHistoryContainer = styled(StyledSwapContainer)`
  margin-top: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 50px;
  }
`

const TabWrapper = styled('div')`
  padding: 20px 20px 0px 20px;
  width: 100%;
  background: ${({ theme }) => theme.colors.navbar};
`

const TabContent = styled('div')`
  margin: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white3};
  border-radius: 20px;
`

export default function OrderHistoryPanel() {
  const [activeTab, setActiveTab] = useState(0)
  const orderStatus: OrderStatus[] = ['open', 'executed', 'cancelled']
  const { isMd, isSm, isXs } = useMatchBreakpoints()
  const isMobile = isMd || isSm || isXs

  const allTokens = useAllTokens()
  const autonomyOrdersLib = useAutonomyOrdersLib()
  const { account } = useActiveWeb3React()

  const switchTab = (index) => setActiveTab(index)

  const { data } = useQuery(
    'orders',
    async () => {
      if (!account || !autonomyOrdersLib) {
        return []
      }
      const orders = await autonomyOrdersLib.getOrders(account)
      return orders
    },
    {
      refetchInterval: 4_000,
    },
  )

  return (
    <OrderHistoryContainer>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <TabWrapper>
            <Tabs activeTab={activeTab} size="md" variant="fullWidth">
              <Tab
                index={0}
                label="OPEN ORDERS"
                size={isMobile ? 'xsm' : 'md'}
                activeTab={activeTab}
                variant="fullWidth"
                onClick={switchTab}
              />
              <Tab
                index={1}
                label="CLOSED"
                size={isMobile ? 'xsm' : 'md'}
                variant="fullWidth"
                activeTab={activeTab}
                onClick={switchTab}
              />
              <Tab
                index={2}
                label="CANCELLED"
                size={isMobile ? 'xsm' : 'md'}
                variant="fullWidth"
                activeTab={activeTab}
                onClick={switchTab}
              />
            </Tabs>
          </TabWrapper>
          <TabContent id="order-history-panel">
            {data &&
              data
                .filter((order) => order.status === orderStatus[activeTab])
                .map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    tokenPair={{
                      input: allTokens[getAddress(order.inputToken)],
                      output: allTokens[getAddress(order.outputToken)],
                    }}
                  />
                ))}
          </TabContent>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </OrderHistoryContainer>
  )
}
