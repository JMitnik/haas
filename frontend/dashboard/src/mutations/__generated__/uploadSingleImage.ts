/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: uploadSingleImage
// ====================================================

export interface uploadSingleImage_singleUpload {
  __typename: "ImageType";
  url: string | null;
}

export interface uploadSingleImage {
  singleUpload: uploadSingleImage_singleUpload;
}

export interface uploadSingleImageVariables {
  file: any;
}
