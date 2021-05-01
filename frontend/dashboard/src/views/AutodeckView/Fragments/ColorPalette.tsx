import styled from "styled-components"
import { Flex } from "@haas/ui"
import { UseFormMethods } from "react-hook-form"
import { FormDataProps } from "../Types"
import React, { useState, useEffect } from "react"

const ColorEntry = styled(Flex) <{ isSelected: boolean }>`
  cursor: pointer;
  padding: 20px 40px;
  border-radius: 9px;
  align-items: center;
  box-shadow: ${props => props.isSelected ? 'rgba(0, 0, 0, 0.20) 0px 4px 12px;' : 'none'};
`

const ColourContainer = styled(Flex) <{ isSelected: boolean }>`
  cursor: pointer;
  border: ${props => props.isSelected ? '1px solid' : 'none'};
  border-radius: ${props => props.isSelected ? '9px' : 'none'};
  padding: 10px;
  align-items: center;
  flex-direction: column;
`

const ColorPaletteFragment = ({ form, onChange, value, palette }:
  { form: UseFormMethods<FormDataProps>, onChange: any, value: any, palette: Array<string> }) => {
  const [currColor, setCurrColor] = useState(palette[0])

  useEffect(() => {
    setCurrColor(palette[0])
  }, [palette])

  const handleColorChange = (color: string) => {
    setCurrColor(color)
    onChange(color)
  }

  return (
    <Flex flexDirection="row" justifyContent="space-around">
      {palette.map((color) => (
        <ColourContainer
          isSelected={color === currColor}
          key={color}
          onClick={() => handleColorChange(color)}>
          <ColorEntry
            isSelected={color === currColor}
            backgroundColor={color}>
          </ColorEntry>
          <span style={{ fontWeight: color === currColor ? 500 : 'normal' }}>{color}</span>
        </ColourContainer>

      ))}
    </Flex>
  )
}

export default ColorPaletteFragment
