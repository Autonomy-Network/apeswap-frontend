import React from 'react'
import { Text } from '@apeswapfinance/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import { usePersonalTvl } from 'state/hooks'
import CardValue from './CardValue'

const PersonalTvl = () => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const { tvl } = usePersonalTvl()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '60px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return <CardValue fontSize="28px" decimals={0} value={tvl} prefix="$" />
}

export default PersonalTvl