import React from 'react'
import styled from 'styled-components'
import { Flex, Button, useMatchBreakpoints, Tabs, Tab } from '@apeswapfinance/uikit'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { CHAIN_ID } from 'config/constants/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useLocation, useHistory } from 'react-router-dom'

interface Props {
  title?: string
  subtitle?: string
  noConfig?: boolean
  isChartDisplayed?: boolean
}

const CurrencyInputContainer = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px 0px 20px;
  width: 100%;
  background: ${({ theme }) => theme.colors.navbar};
  margin-bottom: 20px;
`

const CurrencyInputHeader: React.FC<Props> = () => {
  const { isMd, isSm, isXs } = useMatchBreakpoints()
  const { chainId } = useActiveWeb3React()
  const history = useHistory()
  const isMobile = isMd || isSm || isXs
  const path = useLocation()

  const getActiveTab = () => {
    const { pathname } = path
    if (pathname.includes('swap')) return 0
    if (pathname.includes('orders')) return 1
    return 2
  }

  return (
    <CurrencyInputContainer>
      <Tabs activeTab={getActiveTab()} size="md">
        <Tab
          index={0}
          label="SWAP"
          onClick={() => history.push('/swap')}
          size={isMobile ? 'xsm' : 'md'}
          variant="centered"
          activeTab={getActiveTab()}
        />
        {chainId === CHAIN_ID.BSC ? (
          <Tab
            index={1}
            label="ORDERS"
            onClick={() => history.push('/orders')}
            size={isMobile ? 'xsm' : 'md'}
            variant="centered"
            activeTab={getActiveTab()}
          />
        ) : (
          <></>
        )}
        <Tab
          index={2}
          label="LIQUIDITY"
          onClick={() => history.push('/pool')}
          size={isMobile ? 'xsm' : 'md'}
          variant="centered"
          activeTab={getActiveTab()}
        />
      </Tabs>
      <Flex>
        <a href="https://app.multichain.org/" target="_blank" rel="noopener noreferrer">
          <Button
            style={{
              fontSize: '15px',
              fontWeight: 700,
              marginRight: '25px',
              marginLeft: '15px',
              padding: 10,
              display: isMobile ? 'none' : 'block',
            }}
          >
            BRIDGE
          </Button>
        </a>
        <GlobalSettings />
      </Flex>
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
