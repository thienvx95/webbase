import * as sharp from 'sharp';

export const resizeImage = async (
  image: Express.Multer.File,
  width: number,
  height: number,
): Promise<Express.Multer.File> => {
  const transformer = await sharp(image.buffer)
    .resize({ width: width, height: height, fit: 'fill' })
    .png()
    .toBuffer();
  image.buffer = transformer;
  return image;
};
