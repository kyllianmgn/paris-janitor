import {Star} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {PropertyReview, ServiceReview} from "@/types";

export default function ReviewEditor({baseReview,uploadReview}:{baseReview: PropertyReview|ServiceReview|null,uploadReview: (note: number, comment: string) => Promise<PropertyReview|ServiceReview|undefined>}){

    const reviewTextAreaRef = useRef<HTMLTextAreaElement>(null);
    const [note, setNote] = useState<number>(1);

    useEffect(() => {
        if (!reviewTextAreaRef.current) return;
        if (baseReview){
            setNote(baseReview.note)
            reviewTextAreaRef.current.value = baseReview.comment
        }
    }, [baseReview]);

    const handleUploadReview = () => {
        if (!reviewTextAreaRef.current) return;
        uploadReview(note, reviewTextAreaRef.current.value);
    }

    return (
        <div className={"my-2"}>
            <h1 className={"font-bold"}>Note</h1>
            <div className={"flex gap-1"}>
                {
                    Array.from({length: 5}).map((_, i) => (
                        <Star className={"cursor-pointer"} fill={i >= note ? "grey" : "yellow"} stroke={"#8c8c8c"}
                              strokeWidth={1.5} key={i} onClick={() => {
                            setNote(i + 1)
                        }}/>
                    ))
                }
            </div>
            <Textarea ref={reviewTextAreaRef}/>
            <Button onClick={handleUploadReview}>Post review</Button>
        </div>
    )
}