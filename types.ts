export interface FileWithPreview extends File {
  preview: string;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
}

export interface ImageGeneratorInputs {
  characterImage: ImageFile;
  objectImage?: ImageFile;
  backgroundImage?: ImageFile;
  clothing: string;
  action: string;
  journalisticStyle: boolean;
}

export interface ThumbnailGeneratorInputs {
  templateImage: ImageFile;
  characterImage: ImageFile;
  backgroundImage?: ImageFile;
  text: string;
}
