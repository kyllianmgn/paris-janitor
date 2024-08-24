import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Property} from "@/types";

const PropertySelector: React.FC<{ properties: Property[], selectedProperty: Property | null, onSelectProperty: (property: Property) => void }> = ({ properties, selectedProperty, onSelectProperty }) => {
    if (properties.length === 0) {
        return (
            <Link href="/my-properties/new" passHref>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
            </Link>
        );
    }

    if (properties.length === 1) {
        return (
            <div className="flex items-center space-x-2">
                <div className="font-semibold">{properties[0].address}</div>
                <Link href="/my-properties/new" passHref>
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Property
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between">
                        {selectedProperty?.address || properties[0].address}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                    {properties.map(property => (
                        <DropdownMenuItem
                            key={property.id}
                            onSelect={() => onSelectProperty(property)}
                        >
                            {property.address}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>

            </DropdownMenu>
            <Link href="/my-properties/new" passHref>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
            </Link>
        </div>
    );
};

export default PropertySelector;