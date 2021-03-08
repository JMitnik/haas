import React, { useRef, useState, useEffect } from 'react'
import { useRemovePixelRangeMutation, useWhitifyImageMutation, useGetAdjustedLogoLazyQuery, RemovePixelRangeInput } from 'types/generated-types';
import { Div, Flex } from '@haas/ui';
import { Spinner, Button } from '@chakra-ui/core';

const Canvas = ({ id, value, onChange }: any) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [activeColor, setActiveColor] = useState<Array<number>>([255, 255, 255])
  const [activeBackground, setActiveBackground] = useState<string>('white')
  const [removePixel, { loading: removePixelLoading }] = useRemovePixelRangeMutation();
  const [whitifyImage, { loading: whitifyLoading }] = useWhitifyImageMutation({
    onCompleted: () => {
      setActiveBackground('black');
    }
  });

  const [fetchAdjustLogo, { loading: adjustedLoading }] = useGetAdjustedLogoLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (result) => {
      onChange(result.getAdjustedLogo?.url)
    }
  })

  useEffect(() => {
    fetchAdjustLogo({
      variables: {
        input: {
          bucket: 'haas-autodeck-logos',
          id,
          reset: true,
        }
      },
    })
  }, [])

  useEffect(() => {
    const context = ref.current?.getContext('2d');
    console.log('CONTEXT CANVAS: ', context);
    if (ref.current?.width && ref.current?.height && context) {
      context.clearRect(0, 0, ref.current?.width, ref.current?.height);
    }

    if (value && context) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      const source = value.split('#')[0]
      image.src = source;

      image.onload = () => {
        context.drawImage(image, 0, 0);
      };
    }
  }, [value])

  function getMousePosition(e: any, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.

    return {
      x,
      y
    };
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = ref.current?.getContext('2d');
    const eventLocation = ref.current && getMousePosition(e, ref.current)
    console.log('event location: ', eventLocation);

    if (eventLocation?.x && eventLocation?.y) {
      const color = context?.getImageData(eventLocation?.x, eventLocation?.y, 1, 1).data
      console.log('clicked color: ', color)
      context?.fillRect(eventLocation.x, eventLocation.y, 1, 1)
      if (color) setActiveColor([color[0], color[1], color[2]])

    }
  }

  const handleRemovePixel = () => {
    let fileKey = value?.split('.com/')?.[1]
    fileKey = fileKey?.split('#')[0]

    console.log('fileKey: ', fileKey);
    const input: RemovePixelRangeInput = {
      red: activeColor[0],
      green: activeColor[1],
      blue: activeColor[2],
      range: 50,
      bucket: 'haas-autodeck-logos',
      key: fileKey
    }

    console.log('input: ', input);

    removePixel({
      variables: {
        input
      }
    })
  }

  const handleReset = () => {
    setActiveBackground('white')
    fetchAdjustLogo({
      variables: {
        input: {
          bucket: 'haas-autodeck-logos',
          id,
          reset: true,
        }
      },
    })
  }

  const handleReload = () => {
    fetchAdjustLogo({
      variables: {
        input: {
          bucket: 'haas-autodeck-logos',
          id,
          reset: false,
        }
      },
    })
  }

  const handleWhitify = () => {
    let fileKey = value.split('.com/')?.[1]
    fileKey = fileKey.split('#')[0]

    whitifyImage({
      variables: {
        input: {
          key: fileKey,
          bucket: 'haas-autodeck-logos',
        }
      }
    })
  }

  const handleBackgroundswitch = () => {
    setActiveBackground((prevState) => {
      return prevState === 'black' ? 'white' : 'black';
    })
  }

  return (
    <>
      <Button
        marginBottom="5px"
        onClick={handleBackgroundswitch}
      >
        Switch background
      </Button>
      <Div position="relative">
        <Div backgroundColor={activeBackground}>
          <canvas style={{ position: 'relative' }} onClick={(e) => handleCanvasClick(e)} width="800px" height="600px" ref={ref} />
        </Div>
        {adjustedLoading && (
          <Div position="absolute" top="280px" right="380px">
            <Spinner />
          </Div>
        )}

        <Div
          position="absolute"
          top="0"
          right="0"
          width="50px"
          height="50px"
          backgroundColor={`rgba(${activeColor[0]}, ${activeColor[1]}, ${activeColor[2]})`}
        />
        <Flex marginTop="5px" justifyContent="space-evenly">
          <Button
            isLoading={removePixelLoading}
            // isDisabled={!form.formState.isValid}
            variantColor="teal"
            onClick={handleRemovePixel}
          >
            Remove pixel
        </Button>
          <Button
            isLoading={whitifyLoading}
            // isDisabled={!form.formState.isValid}
            variantColor="blue"
            onClick={handleWhitify}
          >
            Whitify
        </Button>
          <Button
            isLoading={adjustedLoading}
            // isDisabled={!form.formState.isValid}
            variantColor="purple"
            onClick={handleReload}
          >
            Reload
        </Button>
          <Button
            isLoading={adjustedLoading}
            // isDisabled={!form.formState.isValid}
            variantColor="red"
            onClick={handleReset}
          >
            Reset
        </Button>
        </Flex>

      </Div>
    </>
  )
}

export default Canvas