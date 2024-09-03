import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DetailsSectionProps {
    title: string;
    children: React.ReactNode;
    key?: number | string | any;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ title, children }) => (
    <Card className="mb-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

interface EntityDetailsProps<T> {
    entity: T;
    title: string;
    sections: {
        title: string;
        content: (entity: T) => React.ReactNode;
    }[];
    actions?: React.ReactNode;
}

export function EntityDetails<T>({ entity, title, sections, actions }: EntityDetailsProps<T>) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{title}</h1>
                {actions}
            </div>
            {sections.map((section, index) => (
                <DetailsSection key={index} title={section.title}>
                    {section.content(entity)}
                </DetailsSection>
            ))}
        </div>
    );
}