import { Briefcase, Heart, Mail, PenTool, ThumbsDown, ThumbsUp } from 'react-feather';
import {
  FormControl, FormLabel, Input, InputHelper,
} from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

const PitchdeckFragment = ({ form }: { form: any }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl isInvalid={!!form.formState.errors.companyName} isRequired>
        <FormLabel htmlFor="companyName">{t('autodeck:company_name')}</FormLabel>
        <InputHelper>{t('autodeck:company_name_helper')}</InputHelper>
        <Input
          placeholder="Haas inc."
          leftEl={<Briefcase />}
          name="companyName"
          ref={form.register()}
        />
        {form.formState.errors.companyName?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.companyName?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.answer1} isRequired>
        <FormLabel htmlFor="answer1">{t('autodeck:answer_1')}</FormLabel>
        <InputHelper>{t('autodeck:answer_1_helper')}</InputHelper>
        <Input
          placeholder="Terrible support"
          leftEl={<Briefcase />}
          name="answer1"
          ref={form.register()}
        />
        {form.formState.errors.answer1?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.answer1?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.answer2} isRequired>
        <FormLabel htmlFor="answer2">{t('autodeck:answer_2')}</FormLabel>
        <InputHelper>{t('autodeck:answer_2_helper')}</InputHelper>
        <Input
          placeholder="No space"
          leftEl={<Briefcase />}
          name="answer2"
          ref={form.register()}
        />
        {form.formState.errors.answer2?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.answer2?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.answer3} isRequired>
        <FormLabel htmlFor="name">{t('autodeck:answer_3')}</FormLabel>
        <InputHelper>{t('autodeck:answer_3_helper')}</InputHelper>
        <Input
          placeholder="No internet"
          leftEl={<Briefcase />}
          name="answer3"
          ref={form.register()}
        />
        {form.formState.errors.answer3?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.answer3?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.answer4} isRequired>
        <FormLabel htmlFor="answer4">{t('autodeck:answer_4')}</FormLabel>
        <InputHelper>{t('autodeck:answer_4_helper')}</InputHelper>
        <Input
          placeholder="Rude personnel"
          leftEl={<Briefcase />}
          name="answer4"
          ref={form.register()}
        />
        {form.formState.errors.answer4?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.answer4?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.sorryAboutX} isRequired>
        <FormLabel htmlFor="sorryAboutX">{t('autodeck:sorry_about_x')}</FormLabel>
        <InputHelper>{t('autodeck:sorry_about_x_helper')}</InputHelper>
        <Input
          placeholder="The unfriendly service"
          leftEl={<ThumbsDown />}
          name="sorryAboutX"
          ref={form.register()}
        />
        {form.formState.errors.sorryAboutX?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.sorryAboutX?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.youLoveX} isRequired>
        <FormLabel htmlFor="youLoveX">{t('autodeck:you_love_x')}</FormLabel>
        <InputHelper>{t('autodeck:you_love_x_helper')}</InputHelper>
        <Input
          placeholder="Our product"
          leftEl={<ThumbsUp />}
          name="youLoveX"
          ref={form.register()}
        />
        {form.formState.errors.youLoveX?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.youLoveX?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.reward} isRequired>
        <FormLabel htmlFor="reward">{t('autodeck:reward')}</FormLabel>
        <InputHelper>{t('autodeck:reward_helper')}</InputHelper>
        <Input
          placeholder="And you both get a 20 percent discount"
          leftEl={<Heart />}
          name="reward"
          ref={form.register()}
        />
        {form.formState.errors.reward?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.reward?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.emailContent} isRequired>
        <FormLabel htmlFor="emailContent">{t('autodeck:email_content')}</FormLabel>
        <InputHelper>{t('autodeck:email_content_helper')}</InputHelper>
        <Input
          placeholder="We see that you have just used on of our services"
          leftEl={<Mail />}
          name="emailContent"
          ref={form.register()}
        />
        {form.formState.errors.emailContent?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.emailContent?.message}</span>}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.textMessage} isRequired>
        <FormLabel htmlFor="textMessage">{t('autodeck:text_content')}</FormLabel>
        <InputHelper>{t('autodeck:text_content_helper')}</InputHelper>
        <Input
          placeholder="Hi Passi - thank you for purchasing one of our products. Why dont you tell us how you feel?"
          leftEl={<PenTool />}
          name="textMessage"
          ref={form.register()}
        />
        {form.formState.errors.textMessage?.message
          && <span style={{ marginTop: '5px', color: 'red' }}>{form.formState.errors.textMessage?.message}</span>}
      </FormControl>
    </>
  );
};

export default PitchdeckFragment;
