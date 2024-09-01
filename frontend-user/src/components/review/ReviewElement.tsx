import {PropertyReview, ServiceReview} from "@/types";
import {Star} from "lucide-react";

export const ReviewElement = ({baseReview}: { baseReview: PropertyReview | ServiceReview }) => {

    return (
        <div className="my-2">
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
