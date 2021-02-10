import * as yup from 'yup';
import styled from 'styled-components';
import { Briefcase, Clipboard, Link, Link2, Upload, ThumbsDown, ThumbsUp, Play, Pause, AlertCircle, Mail, PenTool, Heart, Edit2, UploadCloud } from 'react-feather';
import { useGetPreviewDataLazyQuery, useUploadJobImageMutation, CreateWorkspaceJobMutation, Exact, GenerateAutodeckInput, CreateWorkspaceJobType, ConfirmWorkspaceJobMutation, useRemovePixelRangeMutation, RemovePixelRangeInput, useWhitifyImageMutation, useGetAdjustedLogoQuery, useGetAdjustedLogoLazyQuery } from 'types/generated-types';
import { Button, ButtonGroup, RadioButtonGroup, useToast, Spinner } from '@chakra-ui/core';
import { Controller, UseFormMethods, useForm } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper,
  Muted,
  RadioButton,
  RadioButtons,
  Flex,
} from '@haas/ui';
import { useHistory } from 'react-router';
import { MutationFunctionOptions } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useState, useRef } from 'react';
import cuid from 'cuid';

import ColorPickerInput from 'components/ColorPicker';

import FileDropInput from 'components/FileDropInput';

import { DeepPartial } from 'types/customTypes';
import { useEffect } from 'react';
import boolToInt from 'utils/booleanToNumber';

const CustomerUploadLogoInput = ({ onChange, value, jobId, imageType, isInEditing, isDisapproved }: any) => {
  const toast = useToast();

  const [uploadFile, { loading }] = useUploadJobImageMutation({
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
      onChange(result.uploadJobImage?.url);
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'We were unable to upload file. Try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  })

  const onDrop = (files: File[]) => {
    if (!files.length) return;
    onChange('');
    const [file] = files;
    const disapproved: boolean = isDisapproved || false
    uploadFile({ variables: { file, jobId, type: imageType, disapproved } });
  };

  useEffect(() => {
    if (value) {
      onChange(value)
    }
  }, [value])

  return (
    <>
      <FileDropInput isInEditing={isInEditing} value={value} onDrop={onDrop} isLoading={loading} />
    </>
  );
};

const WebsiteScreenshotFragment = ({ form, jobId, isInEditing }: {
  form: UseFormMethods<FormDataProps>, jobId: string, isInEditing: boolean,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {!isInEditing &&
        <FormControl>
          <FormLabel>{t('website_screenshot')}</FormLabel>
          <InputHelper>{t('website_screenshot_subtext')}</InputHelper>
          <Controller
            control={form.control}
            name="useWebsiteUrl"
            defaultValue={1}
            render={({ onChange, value }) => (
              <RadioButtonGroup
                value={value}
                isInline
                onChange={onChange}
                display="flex"
              >
                <RadioButton icon={Link2} value={1} text={t('existing_url')} description={t('existing_url_helper')} />
                <RadioButton icon={Upload} value={0} text={t('upload_file')} description={t('upload_file_helper')} />
              </RadioButtonGroup>
            )}
          />
        </FormControl>
      }


      {!isInEditing && form.watch('useWebsiteUrl') === 1 && (
        <FormControl isInvalid={!!form.errors.website} isRequired>
          <FormLabel htmlFor="website">{t('autodeck:website')}</FormLabel>
          <InputHelper>{t('autodeck:website_helper')}</InputHelper>
          <Input
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            leftEl={<Link />}
            name="website"
            ref={form.register()}
          />
        </FormControl>

      )}  {!isInEditing && form.watch('useWebsiteUrl') === 0 && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadWebsite"
              defaultValue=""
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput isInEditing={isInEditing} jobId={jobId} value={value} onChange={onChange} imageType="WEBSITE_SCREENSHOT" />
              )}
            />
          </FormControl>
        </>
      )}

      {isInEditing && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadWebsite"
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput
                  isInEditing={isInEditing && form.watch('isWebsiteUrlApproved') === 1}
                  jobId={jobId} value={value}
                  onChange={onChange}
                  imageType="WEBSITE_SCREENSHOT"
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{'Website screenshot approval'}</FormLabel>
            <InputHelper>{'Approve or edit the website screenshot used for document generation'}</InputHelper>
            <Controller
              control={form.control}
              name="isWebsiteUrlApproved"
              defaultValue={1}
              render={({ onChange, value }) => (
                <RadioButtonGroup
                  value={value}
                  isInline
                  onChange={onChange}
                  display="flex"
                >
                  <RadioButton icon={ThumbsUp} value={1} text={'Approve'} description={'Use current website screenshot'} />
                  <RadioButton icon={ThumbsDown} value={0} text={'Edit'} description={'Upload new website screenshot'} />
                </RadioButtonGroup>
              )}
            />
          </FormControl>
        </>
      )}
    </>
  );
};

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

const PrimaryColourFragment = ({ form, isInEditing, palette }: { form: UseFormMethods<FormDataProps>, isInEditing: boolean, palette: Array<string> }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl>
        <FormLabel>{t('autodeck:primary_color')}</FormLabel>
        <InputHelper>{t('autodeck:primary_color_helper')}</InputHelper>

        <Controller
          control={form.control}
          key={'customer_color_controller'}
          name="useCustomColour"
          render={({ onChange, onBlur, value }) => (
            <RadioButtons
              value={value}
              key={'customer_color_key'}
              onChange={onChange}
              onBlur={onBlur}
            >
              <RadioButton icon={Link2} value={1} text={t('autodeck:logo_color')} description={t('autodeck:logo_color_helper')} />
              <RadioButton icon={Clipboard} value={0} text={t('autodeck:custom_color')} description={t('autodeck:custom_color_helper')} />
            </RadioButtons>
          )}
        />

      </FormControl>

      {form.watch('useCustomColour') === 1 && isInEditing && (
        <FormControl>
          <FormLabel htmlFor="primaryColour">{t('branding_color')}</FormLabel>
          <InputHelper>{t('customer:branding_color_helper')}</InputHelper>
          <Controller
            control={form.control}
            name="primaryColour"
            defaultValue="#BEE3F8"
            render={({ onChange, value }) => (
              <ColorPaletteFragment palette={palette} form={form} onChange={onChange} value={value} />
            )}
          />
        </FormControl>
      )}

      {form.watch('useCustomColour') === 0 &&
        <>
          <FormControl isInvalid={!!form.errors.primaryColour} isRequired>
            <FormLabel htmlFor="primaryColour">{t('branding_color')}</FormLabel>
            <InputHelper>{t('customer:branding_color_helper')}</InputHelper>
            <Controller
              control={form.control}
              name="primaryColour"
              defaultValue="#BEE3F8"
              as={<ColorPickerInput />}
            />
          </FormControl>
        </>
      }
    </>
  );
};

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

const CustomerLogoFormFragment = ({ form, jobId, previewLogo, isInEditing }: { form: UseFormMethods<FormDataProps>, jobId: string, previewLogo: string, isInEditing: boolean }) => {
  const { t } = useTranslation();

  return (
    <>
      {!isInEditing && (
        <FormControl>
          <FormLabel>{t('logo')}</FormLabel>
          <InputHelper>{t('customer:logo_helper')}</InputHelper>

          <Controller
            control={form.control}
            name="useCustomUrl"
            render={({ onChange, value }) => (
              <RadioButtonGroup
                value={value}
                isInline
                onChange={onChange}
                display="flex"
              >
                <RadioButton icon={Link2} value={1} text={t('existing_url')} description={t('existing_url_helper')} />
                <RadioButton icon={Upload} value={0} text={t('upload_file')} description={t('upload_file_helper')} />
              </RadioButtonGroup>
            )}
          />

        </FormControl>
      )}


      {!isInEditing && form.watch('useCustomUrl') === 1 && (
        <FormControl>
          <FormLabel htmlFor="logo">{t('logo_existing_url')}</FormLabel>
          <InputHelper>{t('logo_existing_url_helper')}</InputHelper>
          <Input
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            leftEl={<Link />}
            name="logo"
            isInvalid={!!form.errors.logo}
            ref={form.register()}
          />
        </FormControl>

      )}
      {!isInEditing && form.watch('useCustomUrl') === 0 && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadLogo"
              defaultValue={previewLogo || ""}
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput isInEditing={isInEditing} jobId={jobId} value={value} onChange={onChange} imageType="LOGO" />
              )}
            />
          </FormControl>
        </>
      )}

      {isInEditing && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadLogo"
              defaultValue={previewLogo || ""}
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput
                  isDisapproved={form.watch('isLogoUrlApproved') === 0}
                  isInEditing={form.watch('isEditingLogo') !== 0}
                  jobId={jobId}
                  value={value}
                  onChange={onChange}
                  imageType="LOGO"
                />
              )}
            />
            {form.watch('isEditingLogo') === 0 && (
              <Flex marginTop="5px">
                <Div width="auto" color="orange">
                  <AlertCircle color="orange" />
                </Div>
                <Div marginLeft="5px">The newly uploaded logo will <span style={{ fontWeight: 'bold' }}>override</span> the currently used logo and <span style={{ fontWeight: 'bold' }}>no background removal</span> will be performed.</Div>
              </Flex>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>{'Website screenshot approval'}</FormLabel>
            <InputHelper>{'Approve or edit the website screenshot used for document generation'}</InputHelper>
            <Controller
              control={form.control}
              name="isLogoUrlApproved"
              defaultValue={1}
              render={({ onChange, value }) => (
                <RadioButtonGroup
                  value={value}
                  isInline
                  onChange={onChange}
                  display="flex"
                >
                  <RadioButton icon={ThumbsUp} value={1} text={'Approve'} description={'Use current logo'} />
                  <RadioButton icon={ThumbsDown} value={0} text={'Edit'} description={'Use different logo'} />
                </RadioButtonGroup>
              )}
            />

          </FormControl>
          {form.watch('isLogoUrlApproved') === 0 && (
            <FormControl>
              <FormLabel>Edit current logo</FormLabel>
              <InputHelper>{'Upload new logo or edit the current logo'}</InputHelper>
              <Controller
                control={form.control}
                name="isEditingLogo"
                defaultValue={0}
                render={({ onChange, value }) => (
                  <RadioButtonGroup
                    value={value}
                    isInline
                    onChange={onChange}
                    display="flex"
                  >
                    <RadioButton icon={UploadCloud} value={0} text={'Upload'} description={'Upload new logo'} />
                    <RadioButton icon={Edit2} value={1} text={'Edit'} description={'Edit current logo'} />
                  </RadioButtonGroup>
                )}
              />

            </FormControl>
          )}

          {form.watch('isEditingLogo') === 1 && (
            <FormControl>
              <FormLabel htmlFor="cloudinary">Logo adjustment</FormLabel>
              <Controller
                control={form.control}
                name="adjustedLogo"
                render={({ onChange, value }) => (
                  <Canvas id={jobId} onChange={onChange} value={value} />
                )}
              />
            </FormControl>
          )}
        </>
      )}

      {!isInEditing && (
        <FormControl>
          <FormLabel>{t('logo')}</FormLabel>
          <InputHelper>{t('customer:logo_helper')}</InputHelper>

          <Controller
            control={form.control}
            name="useRembg"
            render={({ onChange, value }) => (
              <RadioButtonGroup
                value={value}
                isInline
                onChange={onChange}
                display="flex"
              >
                <RadioButton icon={Play} value={1} text={t('autodeck:use_rembg')} description={t('autodeck:use_rembg_helper')} />
                <RadioButton icon={Pause} value={0} text={t('autodeck:original_image')} description={t('autodeck:original_image_helper')} />
              </RadioButtonGroup>
            )}
          />

        </FormControl>
      )}

    </>
  );
};

const DialogueMultiChoiceFragment = ({ form }: { form: UseFormMethods<FormDataProps> }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl isInvalid={!!form.errors.companyName} isRequired>
        <FormLabel htmlFor="companyName">{t('autodeck:company_name')}</FormLabel>
        <InputHelper>{t('autodeck:company_name_helper')}</InputHelper>
        <Input
          placeholder="Haas inc."
          leftEl={<Briefcase />}
          name="companyName"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer1} isRequired>
        <FormLabel htmlFor="answer1">{t('autodeck:answer_1')}</FormLabel>
        <InputHelper>{t('autodeck:answer_1_helper')}</InputHelper>
        <Input
          placeholder="Terrible support"
          leftEl={<Briefcase />}
          name="answer1"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer2} isRequired>
        <FormLabel htmlFor="answer2">{t('autodeck:answer_2')}</FormLabel>
        <InputHelper>{t('autodeck:answer_2_helper')}</InputHelper>
        <Input
          placeholder="No space"
          leftEl={<Briefcase />}
          name="answer2"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer3} isRequired>
        <FormLabel htmlFor="name">{t('autodeck:answer_3')}</FormLabel>
        <InputHelper>{t('autodeck:answer_3_helper')}</InputHelper>
        <Input
          placeholder="No internet"
          leftEl={<Briefcase />}
          name="answer3"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer4} isRequired>
        <FormLabel htmlFor="answer4">{t('autodeck:answer_4')}</FormLabel>
        <InputHelper>{t('autodeck:answer_4_helper')}</InputHelper>
        <Input
          placeholder="Rude personnel"
          leftEl={<Briefcase />}
          name="answer4"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.sorryAboutX} isRequired>
        <FormLabel htmlFor="sorryAboutX">{t('autodeck:sorry_about_x')}</FormLabel>
        <InputHelper>{t('autodeck:sorry_about_x_helper')}</InputHelper>
        <Input
          placeholder="The unfriendly service"
          leftEl={<ThumbsDown />}
          name="sorryAboutX"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.youLoveX} isRequired>
        <FormLabel htmlFor="youLoveX">{t('autodeck:you_love_x')}</FormLabel>
        <InputHelper>{t('autodeck:you_love_x_helper')}</InputHelper>
        <Input
          placeholder="Our product"
          leftEl={<ThumbsUp />}
          name="youLoveX"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.reward} isRequired>
        <FormLabel htmlFor="reward">{t('autodeck:reward')}</FormLabel>
        <InputHelper>{t('autodeck:reward_helper')}</InputHelper>
        <Input
          placeholder="And you both get a 20 percent discount"
          leftEl={<Heart />}
          name="reward"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.emailContent} isRequired>
        <FormLabel htmlFor="emailContent">{t('autodeck:email_content')}</FormLabel>
        <InputHelper>{t('autodeck:email_content_helper')}</InputHelper>
        <Input
          placeholder="We see that you have just used on of our services"
          leftEl={<Mail />}
          name="emailContent"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.textMessage} isRequired>
        <FormLabel htmlFor="textMessage">{t('autodeck:text_content')}</FormLabel>
        <InputHelper>{t('autodeck:text_content_helper')}</InputHelper>
        <Input
          placeholder="Hi Passi - thank you for purchasing one of our products. Why dont you tell us how you feel?"
          leftEl={<PenTool />}
          name="textMessage"
          ref={form.register()}
        />
      </FormControl>
    </>
  );
};

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  website: yup.string().required('Website is required'),
  logo: yup.string().url('Url should be valid'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
  useRembg: yup.number(),
  useCustomUrl: yup.number(),
  useCustomColour: yup.number(),
  useWebsiteUrl: yup.number(),
  isEditingLogo: yup.number(),
  isWebsiteUrlApproved: yup.number(),
  isLogoUrlApproved: yup.number(),
  uploadLogo: yup.string().url(),
  adjustedLogo: yup.string().url(),
  firstName: yup.string(),
  companyName: yup.string(),
  answer1: yup.string(),
  answer2: yup.string(),
  answer3: yup.string(),
  answer4: yup.string(),
  sorryAboutX: yup.string(),
  youLoveX: yup.string(),
  reward: yup.string(),
  emailContent: yup.string(),
  textMessage: yup.string()
}).required();

type FormDataProps = yup.InferType<typeof schema>;

interface AutodeckFormProps {
  onClose: () => void;
  isLoading: boolean;
  onCreateJob: (options?: MutationFunctionOptions<CreateWorkspaceJobMutation, Exact<{
    input?: GenerateAutodeckInput | null | undefined;
  }>> | undefined) => Promise<any>;
  job: DeepPartial<CreateWorkspaceJobType> | null;
  isInEditing: boolean;
  onConfirmJob: (options?: MutationFunctionOptions<ConfirmWorkspaceJobMutation, Exact<{
    input?: GenerateAutodeckInput | null | undefined;
  }>> | undefined) => Promise<any>;
  isConfirmLoading: boolean;
}

const AutodeckForm = ({
  onClose,
  isLoading,
  onCreateJob,
  job,
  isInEditing,
  onConfirmJob,
  isConfirmLoading
}: AutodeckFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [activeJobId, setActiveJobId] = useState(cuid());

  const [fetchPreviewData, { data: previewData, loading: previewLoading }] = useGetPreviewDataLazyQuery()

  const form = useForm<FormDataProps>({
    defaultValues: {
      useCustomUrl: 0,
      useCustomColour: boolToInt(job?.requiresColorExtraction) || 1,
      useWebsiteUrl: isInEditing ? 0 : 1,
      useRembg: 1,
      name: job?.name,
    },
    mode: 'all'
  });

  console.log('isEditingLogo', form.watch('isEditingLogo'))

  const onFormSubmit = (data: FormDataProps) => {
    const requiresRembgLambda = data?.useRembg === 1 ? true : false;
    const requiresColorExtraction = data?.useCustomColour === 1 ? true : false;
    const requiresWebsiteScreenshot = data?.useWebsiteUrl === 1 ? true : false;
    const usesAdjustedLogo = data?.isEditingLogo === 1 ? true : false;

    if (!isInEditing && (requiresRembgLambda || requiresColorExtraction || requiresWebsiteScreenshot)) {
      return onCreateJob({
        variables: {
          input: {
            id: activeJobId,
            name: data.name,
            logo: data.logo || data.uploadLogo,
            website: data.website,
            requiresRembgLambda,
            requiresWebsiteScreenshot,
            requiresColorExtraction,
            primaryColour: data.primaryColour,
            usesAdjustedLogo: false,
          }
        }
      })
    }
    onConfirmJob({
      variables: {
        input: {
          id: job?.id || activeJobId || '',
          name: data.name,
          requiresRembgLambda,
          requiresWebsiteScreenshot,
          requiresColorExtraction,
          firstName: data.firstName,
          companyName: data.companyName,
          answer1: data.answer1,
          answer2: data.answer2,
          answer3: data.answer3,
          answer4: data.answer4,
          primaryColour: data.primaryColour,
          usesAdjustedLogo: usesAdjustedLogo,
          sorryAboutX: data?.sorryAboutX,
          youLoveX: data.youLoveX,
          reward: data.reward,
          emailContent: data.emailContent,
          textMessage: data.textMessage
        }
      }
    })
  }

  useEffect(() => {
    const jobId = job?.id;
    if (!jobId) return;
    fetchPreviewData({
      variables: {
        id: jobId,
      }
    });
  }, [job])

  useEffect(() => {
    if (!previewData) return;
    form.setValue('uploadLogo', previewData?.getPreviewData?.rembgLogoUrl);
    // form.setValue('adjustedLogo', previewData?.getPreviewData?.rembgLogoUrl);
    form.setValue('uploadWebsite', previewData?.getPreviewData?.websiteScreenshotUrl);
    form.setValue('primaryColour', previewData?.getPreviewData?.colors[0])
  }, [previewData])

  return (
    <Form onSubmit={form.handleSubmit(onFormSubmit)}>
      <>
        <FormSection id="about">
          <Div>
            <H3 color="default.text" fontWeight={500} pb={2}>{t('general')}</H3>
            <Muted color="gray.600">
              {t('customer:about_helper')}
            </Muted>
          </Div>
          <Div py={4}>
            <InputGrid>
              <FormControl isInvalid={!!form.errors.name} isRequired>
                <FormLabel htmlFor="name">{t('job_name')}</FormLabel>
                <InputHelper>{t('job_name_helper')}</InputHelper>
                <Input
                  isDisabled={isInEditing}
                  placeholder="Peach inc."
                  leftEl={<Briefcase />}
                  name="name"
                  ref={form.register()}
                />
              </FormControl>
            </InputGrid>
          </Div>
        </FormSection>

        <Hr />

        <FormSection id="logomanipulation">
          <Div>
            <H3 color="default.text" fontWeight={500} pb={2}>{t('logo_manipulation')}</H3>
            <Muted color="gray.600">
              {t('logo_manipulation_helper')}
            </Muted>
          </Div>
          <Div>
            <InputGrid>
              <CustomerLogoFormFragment isInEditing={isInEditing} previewLogo={previewData?.getPreviewData?.rembgLogoUrl || ''} jobId={job?.id || activeJobId} form={form} />
            </InputGrid>
            <Hr />
            <InputGrid>
              <PrimaryColourFragment palette={previewData?.getPreviewData?.colors || []} isInEditing={isInEditing} form={form} />
            </InputGrid>
          </Div>
        </FormSection>

        <Hr />
        <FormSection id="website">
          <Div>
            <H3 color="default.text" fontWeight={500} pb={2}>{t('website_screenshot')}</H3>
            <Muted color="gray.600">
              {t('website_screenshot_helper')}
            </Muted>
          </Div>
          <Div>
            <InputGrid>
              <WebsiteScreenshotFragment isInEditing={isInEditing} jobId={job?.id || activeJobId} form={form} />
            </InputGrid>
          </Div>
        </FormSection>
      </>

      {(isInEditing
        || (form.watch('useRembg') === 0
          && form.watch('useWebsiteUrl') === 0
          && form.watch('useCustomColour') === 0))
        &&
        <>
          <Hr />
          <FormSection id="dialogue">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>{t('autodeck:dialogue')}</H3>
              <Muted color="gray.600">
                {t('autodeck:dialogue_helper')}
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl isInvalid={!!form.errors.firstName} isRequired>
                  <FormLabel htmlFor="name">{t('autodeck:client_first_name')}</FormLabel>
                  <InputHelper>{t('autodeck:client_first_name_helper')}</InputHelper>
                  <Input
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    leftEl={<Link />}
                    name="firstName"
                    // isInvalid={!!form.errors.logo}
                    ref={form.register()}
                  />
                </FormControl>
                <DialogueMultiChoiceFragment form={form} />
              </InputGrid>
            </Div>
          </FormSection>
        </>
      }

      <ButtonGroup>
        <Button
          isLoading={isLoading || isConfirmLoading}
          isDisabled={!form.formState.isValid}
          variantColor="teal"
          type="submit"
        >
          Save
        </Button>
        <Button variant="outline" onClick={() => onClose()}>{t('cancel')}</Button>
      </ButtonGroup>
    </Form>
  );
};

export default AutodeckForm;