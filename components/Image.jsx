import { IKImage } from "imagekitio-react"

const Image = ({ src, className, w, h, alt }) => {

    const isImageKitHosted = typeof src === 'string' && src.startsWith(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT);
    const imagePath = isImageKitHosted ? src.replace(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT, '') : src;
    return (
        <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
            path={imagePath}
            className={className}
            loading="lazy"
            lqip={{ active: true, quality: 20 }}
            alt={alt}
            width={w}
            height={h}
            transformation={[
                {
                    width: w,
                    height: h,
                },
            ]}
        />
    )
}

export default Image;