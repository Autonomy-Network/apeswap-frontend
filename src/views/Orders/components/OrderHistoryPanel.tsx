import { OrderStatus, Order } from '@autonomylabs/limit-stop-orders'
import { getAddress } from '@ethersproject/address'
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
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
  margin-top: -40px;
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

const ORDERS_PER_PAGE = 5

const Pagination = styled(ReactPaginate).attrs({
  activeClassName: 'active',
})`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  padding: 0.75rem 0;
  li {
    height: 32px;
    width: 32px;
    border-radius: 7px;
    border: gray 1px solid;
    cursor: pointer;
    margin-right: 0.5rem;
  }
  li.previous,
  li.next,
  li.break {
    border-color: transparent;
  }
  li.active {
    background-color: #ffb300;
    border-color: transparent;
    color: white;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }

  li a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`

const OrderRows = ({ orders }: { orders: Order[] }) => {
  const allTokens = useAllTokens()

  return (
    <>
      {orders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          tokenPair={{
            input: allTokens[getAddress(order.inputToken)],
            output: allTokens[getAddress(order.outputToken)],
          }}
        />
      ))}
    </>
  )
}

export default function OrderHistoryPanel() {
  const [activeTab, setActiveTab] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrders, setCurrentOrders] = useState<Order[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [orderOffset, setOrderOffset] = useState(0)
  const orderStatus: OrderStatus[] = ['open', 'executed', 'cancelled']
  const { isMd, isSm, isXs } = useMatchBreakpoints()
  const isMobile = isMd || isSm || isXs

  const autonomyOrdersLib = useAutonomyOrdersLib()
  const { account } = useActiveWeb3React()

  const switchTab = (index) => setActiveTab(index)

  const { data } = useQuery(
    'orders',
    async () => {
      if (!account || !autonomyOrdersLib) {
        return []
      }
      const allOrders = await autonomyOrdersLib.getOrders(account)
      allOrders.sort((x, y) => Date.parse(y.time) - Date.parse(x.time))
      return allOrders
    },
    {
      refetchInterval: 4_000,
    },
  )

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ORDERS_PER_PAGE) % orders.length
    setOrderOffset(newOffset)
  }

  useEffect(() => {
    if (data) {
      setOrders(data.filter((order) => order.status === orderStatus[activeTab]))
      setOrderOffset(0)
    }
  }, [data, activeTab])

  useEffect(() => {
    const endOffset = orderOffset + ORDERS_PER_PAGE
    setCurrentOrders(orders.slice(orderOffset, endOffset))
    setPageCount(Math.ceil(orders.length / ORDERS_PER_PAGE))
  }, [orders, orderOffset])

  return (
    <OrderHistoryContainer>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <TabWrapper>
            <Tabs activeTab={activeTab} size="md" variant="fullWidth">
              <Tab
                index={0}
                label="OPEN"
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
            <div>
              <OrderRows orders={currentOrders} />
            </div>
            <Pagination
              previousLabel="<"
              nextLabel=">"
              pageCount={pageCount}
              renderOnZeroPageCount={null}
              onPageChange={handlePageClick}
            />
          </TabContent>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </OrderHistoryContainer>
  )
}
