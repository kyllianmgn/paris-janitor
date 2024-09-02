import {PropertyReview, ServiceReview} from "@/types";
import {Star} from "lucide-react";
import {useEffect, useState} from "react";

export const ReviewElement = ({baseReview}: { baseReview: PropertyReview | ServiceReview }) => {
    const [author, setAuthor] = useState<string>("");

    const loadAuthor = async () => {
        if ("landlord" in baseReview) {
            setAuthor(baseReview.landlord?.user?.firstName + " " + baseReview.landlord?.user?.lastName);
        } else {
            setAuthor(baseReview.traveler?.user?.firstName + " " + baseReview.traveler?.user?.lastName);
        }
    }

    useEffect(() => {
        loadAuthor().then();
    })

    return (
        <div className="my-2">
            <div className="font-bold">
                Auteur: {author}
            </div>
            <h1 className="font-bold">Note</h1>
            <div className="flex gap-1">
                {
                    Array.from({length: 5}).map((_, i) => (
                        <Star className="cursor-pointer" fill={i >= baseReview.note ? "grey" : "yellow"}
                              stroke={"#8c8c8c"} strokeWidth={1.5} key={i}/>
                    ))
                }
            </div>
            <div className="font-bold">
                {baseReview.comment}
            </div>
        </div>
    );
}
