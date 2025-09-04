import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify"

const authenticator = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};


const Upload = ({children,type,setprogress,setcover}) => {

    const ref = useRef(null)

    const onError = (err) => {
        toast.error("upload failed")
        console.log(err)

    }

    const onSuccess = (res) => {
        console.log(res)
        setcover(res)
    }

    const uploadProgress = (progress) => {
        console.log(progress)
        setprogress(Math.round((progress.loaded / progress.total) * 100));
    }

    return (
        <IKContext publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT} authenticator={authenticator} >
            <IKUpload
                useUniqueFileName
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={uploadProgress}
                className="hidden"
                accept={`${type}/*`}
                ref={ref}
            />
            <div className="" onClick={()=>ref.current.click()}>
                {children}
            </div>
        </IKContext>
    )
}

export default Upload