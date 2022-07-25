import { Link } from 'types/core-types';
import { LinkTypeEnumType } from 'types/generated-types';
import facebook from 'assets/images/logo-facebook.png';
import instagram from 'assets/images/logo-instagram.png';
import linkedin from 'assets/images/logo-linkedin.png';
import social from 'assets/images/logo-social.png';
import twitter from 'assets/images/logo-twitter.png';
import whatsapp from 'assets/images/logo-whatsapp.png';

export const getHeaderImage = (link: Link) => {
  if (link.imageUrl) {
    return link.imageUrl;
  }

  if (link.type === LinkTypeEnumType.Whatsapp) {
    return whatsapp;
  }

  if (link.type === LinkTypeEnumType.Instagram) {
    return instagram;
  }

  if (link.type === LinkTypeEnumType.Linkedin) {
    return linkedin;
  }

  if (link.type === LinkTypeEnumType.Facebook) {
    return facebook;
  }

  if (link.type === LinkTypeEnumType.Twitter) {
    return twitter;
  }

  if (link.type === LinkTypeEnumType.Social) {
    return social;
  }

  return '';
};
