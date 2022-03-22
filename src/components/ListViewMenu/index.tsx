import React from 'react'
import { useTheme } from 'styled-components'
import { Select, SelectItem } from '@apeswapfinance/uikit'
import { ListViewProps } from './types'
import FarmTabButtons from './FarmTabButtons'
import SearchInput from './SearchInput'
import {
  ControlContainer,
  HarvestAllWrapper,
  LabelWrapper,
  SectionOneWrapper,
  SectionTwoWrapper,
  StyledCheckbox,
  StyledImage,
  StyledText,
  ToggleWrapper,
} from './styles'
import { OPTIONS } from './constants'

const ListViewMenu: React.FC<ListViewProps> = ({
  onHandleQueryChange,
  onSetSortOption,
  onSetStake,
  harvestAll,
  stakedOnly,
  query,
  showMonkeyImage,
  activeOption,
}) => {
  const { isDark } = useTheme()
  return (
    <ControlContainer>
      <SectionOneWrapper>
        <LabelWrapper>
          <StyledText bold mr="15px">
            Search
          </StyledText>
          <SearchInput onChange={onHandleQueryChange} value={query} />
        </LabelWrapper>
        <Select size="sm" width="150px" onChange={(e) => onSetSortOption(e.target.value)} active={activeOption}>
          {OPTIONS.map((option) => {
            return (
              <SelectItem size="sm" value={option.value}>
                {option.label}
              </SelectItem>
            )
          })}
        </Select>
      </SectionOneWrapper>
      <SectionTwoWrapper>
        <FarmTabButtons />
        <ToggleWrapper onClick={() => onSetStake(!stakedOnly)}>
          <StyledCheckbox checked={stakedOnly} onChange={() => onSetStake(!stakedOnly)} />
          <StyledText> Staked </StyledText>
        </ToggleWrapper>
      </SectionTwoWrapper>
      {harvestAll && <HarvestAllWrapper> {harvestAll} </HarvestAllWrapper>}
      {showMonkeyImage && isDark ? (
        <StyledImage src="/images/farm-night-farmer.svg" alt="night-monkey" />
      ) : (
        <StyledImage src="/images/farm-day-farmer.svg" alt="day-monkey" />
      )}
    </ControlContainer>
  )
}

export default React.memo(ListViewMenu)
