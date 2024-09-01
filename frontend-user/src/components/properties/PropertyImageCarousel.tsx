import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface PropertyImageCarouselProps {
    propertyId: number;
}

const PropertyImageCarousel: React.FC<PropertyImageCarouselProps> = ({ propertyId }) => {
    const apiLink = process.env.NEXT_PUBLIC_API_URL || "https://api.parisjanitor.fr/";

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {[1, 2, 3].map((imageIndex) => (
                    <CarouselItem key={imageIndex}>
                        <img
                            src={`${apiLink}public/image/property/${propertyId}/${imageIndex}.jpeg`}
                            alt={`Property ${propertyId} image ${imageIndex}`}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {[1, 2, 3].map((_, index) => (
                    <div
                        key={index}
                        className="h-2 w-2 rounded-full bg-white mx-1"
                    />
                ))}
            </div>
        </Carousel>
    );
};

export default PropertyImageCarousel;

