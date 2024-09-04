import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface PropertyImageCarouselProps {
    propertyId: number;
    images: string[]
}

const PropertyImageCarousel: React.FC<PropertyImageCarouselProps> = ({ propertyId, images }) => {
    const apiLink = process.env.NEXT_PUBLIC_API_URL || "https://api.parisjanitor.fr/";



    return (
        <Carousel className="w-full">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <img
                            src={`${apiLink}public/image/property/${propertyId}/${image}`}
                            alt={`Property ${propertyId} image ${index+1}`}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {images.map((_, index) => (
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

