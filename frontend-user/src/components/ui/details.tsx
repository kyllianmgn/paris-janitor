import * as React from "react"
import {cn} from "@/lib/utils"

const Details = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn(
            "max-w-3xl mx-auto bg-white p-2 mt-10 rounded-lg border bg-card text-card-foreground shadow-sm",
            className
        )}
        {...props}
    />
))
Details.displayName = "Details"

const DetailsHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6 pb-2", className)}
        {...props}
    />
))
DetailsHeader.displayName = "DetailsHeader"

const DetailsTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-3xl font-semibold mb-4 leading-none tracking-tight flex justify-between items-center",
            className
        )}
        {...props}
    />
))
DetailsTitle.displayName = "DetailsTitle"

const DetailsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 pb-0", className)} {...props} />
))
DetailsContent.displayName = "DetailsContent"

const DetailsFieldName = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
    <p ref={ref} className={cn("text-xl font-semibold mb-2", className)} {...props} />
))
DetailsFieldName.displayName = "DetailsFieldName"

const DetailsField = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
    <p ref={ref} className={cn("rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}/>
))
DetailsField.displayName = "DetailsField"

const DetailsFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0 pb-2", className)}
        {...props}
    />
))
DetailsFooter.displayName = "DetailsFooter"

export {Details, DetailsHeader, DetailsFooter, DetailsTitle, DetailsFieldName, DetailsField, DetailsContent}
