// components/public/CrudModal.tsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface Field {
    name: string;
    label: string;
    type: string;
    options?: string[];
    required?: boolean;
}

interface CrudModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<T>) => void;
    fields: Field[];
    title: string;
    initialData?: Partial<T>;
    mode: 'create' | 'edit' | 'delete';
    additionalActions?: React.ReactNode;
}

function RenderField<T>({
                            field,
                            value,
                            onChange,
                            disabled,
                        }: {
    field: Field;
    value: any;
    onChange: (name: string, value: any) => void;
    disabled: boolean;
}) {
    switch (field.type) {
        case "text":
        case "email":
        case "number":
        case "date":
        case "datetime-local":
            return (
                <Input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={value || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    required={field.required}
                    disabled={disabled}
                />
            );
        case "textarea":
            return (
                <Textarea
                    id={field.name}
                    name={field.name}
                    value={value || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    required={field.required}
                    disabled={disabled}
                />
            );
        case "select":
            return (
                <Select
                    onValueChange={(value) => onChange(field.name, value)}
                    value={value?.toString()}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case "checkbox":
            return (
                <Checkbox
                    id={field.name}
                    checked={value as boolean}
                    onCheckedChange={(checked) => onChange(field.name, checked)}
                    disabled={disabled}
                />
            );
        default:
            return <p>Unsupported field type</p>;
    }
}

export default function CrudModal<T>({
                                 isOpen,
                                 onClose,
                                 onSubmit,
                                 fields,
                                 title,
                                    additionalActions,
                                 initialData = {},
                                 mode,
                             }: CrudModalProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {mode === 'delete' ? (
                    <>
                        <Alert>
                            <AlertDescription>
                                Are you sure you want to delete this item? This action cannot be undone.
                            </AlertDescription>
                        </Alert>
                        <DialogFooter>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => onSubmit(formData)}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <div key={field.name} className="mb-4">
                                <label
                                    htmlFor={field.name}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {field.label}
                                </label>
                                <RenderField
                                    field={field}
                                    value={formData[field.name as keyof T]}
                                    onChange={handleChange}
                                    disabled={mode === 'edit' && field.name === 'id'}
                                />
                            </div>
                        ))}
                        <DialogFooter>
                            {additionalActions}
                            <Button type="submit">
                                {mode === 'create' ? 'Create' : mode === 'edit' ? 'Update' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}