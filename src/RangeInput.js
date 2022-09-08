import React, { memo } from 'react'
import styled from 'styled-components'

const StyledThumb = () => {
  return `
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: #D52B1E;
    border: 0;
    appearance: none;
    box-shadow: 0 0 2px rgba(0,0,0,0.6);
    margin-top: calc(-1 * (20px - 4px ) / 2);
`
}
const StyledThumbFocus = () => {
  return `
    background: white;
    border: 2px solid red;
`
}
const StyledTrack = () => {
  return `
    cursor: pointer;
    width: 100%;
    background-image: linear-gradient(to right, var(--gradient-colors));
    border-radius: 4px;
    height: 4px;
  `
}

const StyledInputWrapper = styled.div`
  display: flex;

  position: relative;
  align-items: center;
  margin-left: 8px;
  max-width: 250px;
  flex: 1;
  min-width: 185px;
  margin-right: 24px;
`

const StyledRangeInput = styled.input`
  --progress-lower: grey;
  --progress-upper: lightgrey;
  --gradient-colors: var(--progress-lower, transparent) 0%,
    var(--progress-lower, transparent) var(--range-slider-progress, 0%),
    var(--progress-upper, transparent) var(--range-slider-progress, 100%),
    var(--progress-upper, transparent) var(--range-slider-progress) 100%;
  background-color: transparent;
  width: 100%;
  height: 20px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: transparent;
  appearance: none;
  outline: none;

  &::-ms-thumb {
    ${StyledThumb}
  }
  &::-moz-range-thumb {
    ${StyledThumb}
  }
  &::-webkit-slider-thumb {
    ${StyledThumb}
  }
  &:focus {
    &::-ms-thumb {
      ${StyledThumbFocus}
    }
    &::-moz-range-thumb {
      ${StyledThumbFocus}
    }
    &::-webkit-slider-thumb {
      ${StyledThumbFocus}
    }
  }
  &::-ms-track {
    ${StyledTrack}
  }
  &::-moz-range-track {
    ${StyledTrack}
  }
  &::-webkit-slider-runnable-track {
    ${StyledTrack}
  }
`

const RangeInput = ({ onChange, value, ...rangeProps }) => {
  const sliderProgress = Math.round(((value - 1) * 100) / (2 - 1))

  const cssVariables = {
    '--range-slider-progress': `${sliderProgress}%`,
  }

  return (
    <StyledInputWrapper>
      <StyledRangeInput
        {...rangeProps}
        type="range"
        value={value}
        onChange={onChange}
        style={cssVariables}
      />
    </StyledInputWrapper>
  )
}

export default memo(RangeInput)
