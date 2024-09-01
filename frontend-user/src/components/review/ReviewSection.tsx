"use client"
import React, {useEffect, useState} from "react";
import {PropertyReview, ServiceReview} from "@/types";
import {ReviewElement} from "@/components/review/ReviewElement";
import {reviewService} from "@/api/services/reviewService";
import {Button} from "@/components/ui/button";

export interface ReviewSectionProps {
    propertyId: number;
    serviceId: number;
}

export const ReviewSection = ({propertyId, serviceId}: Partial<ReviewSectionProps>) => {
    const [reviewList, setReviewList] = useState<PropertyReview[] | ServiceReview[]>([]);
    const [isSorted, setIsSorted] = useState(false);

    const loadPropertyReviews = async () => {
        if (propertyId) {
            const res = await reviewService.getReviewByPropertyId(propertyId);
            setReviewList(res.data);
        }
    }

    const loadServiceReviews = async () => {
        if (serviceId) {
            const res = await reviewService.getReviewByServiceId(serviceId);
            setReviewList(res.data);
        }
    }

    useEffect(() => {
        if (propertyId) {
            loadPropertyReviews().then();
        } else if (serviceId) {
            loadServiceReviews().then();
        } else {
            console.log("Error while loading reviews : no id provided");
        }
    }, []);

    const sortReviews = () => {
        setReviewList(reviewList.sort((a, b) => b.note - a.note));
        setIsSorted(true);
    };

    const resetSort = () => {
        if (propertyId) {
            loadPropertyReviews().then();
        } else if (serviceId) {
            loadServiceReviews().then();
        }
        setIsSorted(false);
    };

    return (
        <div>
            <Button onClick={isSorted ? resetSort : sortReviews}>
                {isSorted ? "Reset Sort" : "Sort by Note"}
            </Button>

            {reviewList.map((review: PropertyReview | ServiceReview) => (
                <ReviewElement baseReview={review} key={review.id}/>
            ))}
        </div>
    );
}
