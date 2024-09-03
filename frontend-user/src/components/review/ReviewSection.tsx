"use client"
import React, {useEffect, useState} from "react";
import {PropertyReview, ServiceReview} from "@/types";
import {ReviewElement} from "@/components/review/ReviewElement";
import {reviewService} from "@/api/services/reviewService";
import {Button} from "@/components/ui/button";
import {ArrowDownNarrowWide, ArrowUpNarrowWide} from "lucide-react";

export interface ReviewSectionProps {
    propertyId: number;
    serviceId: number;
}

export const ReviewSection = ({propertyId, serviceId}: Partial<ReviewSectionProps>) => {
    const [reviewList, setReviewList] = useState<PropertyReview[] | ServiceReview[]>([]);
    const [isSorted, setIsSorted] = useState(true);

    const loadReviews = async () => {
        if (propertyId || serviceId) {
            if (propertyId) {
                const res = await reviewService.getReviewByPropertyId(propertyId);
                const sortedReviews = res.data.sort((a, b) => b.note - a.note);
                setReviewList(sortedReviews);
            } else if (serviceId) {
                const res = await reviewService.getReviewByServiceId(serviceId);
                const sortedReviews = res.data.sort((a, b) => b.note - a.note);
                setReviewList(sortedReviews);
            }
        } else {
            console.error("Error while loading reviews : no id provided");
        }
    }

    useEffect(() => {
        loadReviews().then();
    }, []);

    const reserveReviewsSorting = () => {
        setIsSorted(!isSorted);
        setReviewList(reviewList.reverse());
    }

    return (
        <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-6 pb-4">
            <h4 className="text-2xl font-bold pb-2">Reviews</h4>

            <div className="absolute top-0 right-0 m-6">
                <Button onClick={reserveReviewsSorting}>
                    {isSorted ?
                        (<><ArrowUpNarrowWide/><p>Sort by Worst Note</p></>) :
                        (<><ArrowDownNarrowWide/><p>Sort by Best Note</p></>)
                    }
                </Button>
            </div>
            <div className="w-fit">
                {reviewList.map((review: PropertyReview | ServiceReview) => (
                    <ReviewElement baseReview={review} key={review.id}/>
                ))}
            </div>
        </div>
    );
}
