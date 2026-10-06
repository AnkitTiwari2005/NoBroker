import { Image, ImageProps } from 'expo-image'

export function SafeImage({ style, ...props }: ImageProps) {
  return <Image style={style} contentFit="cover" transition={200} {...props} />
}
