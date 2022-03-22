import React from 'react'
import { Modal, Button } from '@apeswapfinance/uikit'
import useI18n from 'hooks/useI18n'

import { Description } from './styles'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  amount: number
}

const ConfirmModal: React.FC<ApyCalculatorModalProps> = ({ onDismiss, amount }) => {
  const TranslateString = useI18n()

  return (
    <Modal handleClose={onDismiss}>
      <Description fontSize="12px" color="gray">
        {TranslateString(999, 'Buying Golden Banana has a 30% cost.')}
      </Description>
      <Description fontSize="12px" color="gray">
        Pay {amount} for {amount * 0.7}
      </Description>
      <Button>Confirm</Button>
    </Modal>
  )
}

export default ConfirmModal
