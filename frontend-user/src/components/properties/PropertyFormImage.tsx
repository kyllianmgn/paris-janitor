import React, {useEffect, useState} from "react";
import {Image} from "lucide-react";

export const PropertyFormImage = ({file, onDelete, index}: {file: File, onDelete: (index: number) => void, index: number}) => {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const loadImage = async () => {
            if (file) {
                const imageDataUrl = await readFileImage(file);
                setImageSrc(imageDataUrl);
            }
        };
        loadImage().then();
    }, [file]);

    const promiseReadFile = (file: File) => {
        const fr = new FileReader();

        return new Promise<string>((resolve, reject) => {
            fr.onerror = () => {
                fr.abort()
                reject(new DOMException("Could not read file"));
            }

            fr.onloadend = () => {
                if (fr.result !== null) {
                    resolve(String(fr.result))
                }
            }
            fr.readAsDataURL(file);
        })
    }

    const readFileImage = async (file: File) => {
        return await promiseReadFile(file)
    }

    const handleFileDelete = () => {
        onDelete(index)
    }

    return<div onClick={handleFileDelete} className="w-full overflow-clip relative aspect-video border-2 border-gray-400 flex rounded-lg content-center justify-center bg-center">
        <img src={imageSrc} className={"z-10"} alt="Uploaded"/>
        <div style={{position: "absolute", width: "100%", height: "100%", backgroundPosition: "center", backgroundSize: "cover", filter: "blur(2px)",backgroundImage: `url(${imageSrc})`}}>
        </div>
    </div>
}

export const EmptyPropertyFormImage = ({onUpload}: { onUpload: () => void }) => {
    return <div
        className="w-full aspect-video bg-gray-200 border-2 border-gray-400 flex rounded-lg content-center justify-center" onClick={onUpload}>
        <Image color="#9ca3af" size={64}></Image>
    </div>;
}

export const EmptyLittlePropertyFormImage = ({onUpload}: {onUpload: () => void}) => {
    return <div className="w-full aspect-video bg-gray-200 border-2 border-gray-400 flex rounded-lg content-center justify-center" onClick={onUpload}>
        <Image color="#9ca3af" size={32}></Image>
    </div>;
}