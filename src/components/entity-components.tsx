"use client"

import { AlertTriangleIcon, LayoutGridIcon, LayoutListIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "./ui/empty"
import { cn } from "@/lib/utils";
import { 
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "./ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// here entity refers to workflows / credentials / executions all woould use this reusable compoenet

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel?: string;
    disabled?: boolean;
    isCreating?:boolean;
} & (
    | {onNew: () => void; newButtonHref?: never}
    | {newButtonHref: string; onNew?: never}
    | {onNew?: never; newButtonHref?: never}
);


export const EntityHeader = ({
    title,
    description,
    newButtonLabel,
    disabled,
    isCreating,
    onNew,
    newButtonHref,
}: EntityHeaderProps) =>{
    return (
       <div className="flex flex-row items-center justify-between gap-x-4">
        <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
            {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
        </div>
       {onNew && !newButtonHref && (
        <Button
            onClick={onNew}
            size="sm"
            disabled={disabled || isCreating}
        >
            <PlusIcon className="size-4"/>
            {newButtonLabel}
        </Button>
       )}
       {newButtonHref && !onNew && (
        <Button
            size="sm"
            asChild
        >
            <Link href={newButtonHref} prefetch>
                <PlusIcon className="size-4"/>
                {newButtonLabel}
            </Link>
        </Button>
       )}
       </div>
    )
}

export type ViewMode = "list" | "grid";

type EntityContainerProps = {
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
    children: React.ReactNode;
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
}


export const EntityContainer = ({
    header,
    search,
    pagination,
    children,
    viewMode,
    onViewModeChange,
}: EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-7xl w-full flex flex-col h-full gap-y-8">
                {header}
                <div className="flex flex-col gap-y-4 h-full">
                    <div className="flex items-center gap-2">
                        {viewMode && onViewModeChange && (
                            <div className="flex items-center border border-border rounded-lg p-0.5">
                                <Button
                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="size-8"
                                    onClick={() => onViewModeChange("list")}
                                    aria-label="List view"
                                >
                                    <LayoutListIcon className="size-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="size-8"
                                    onClick={() => onViewModeChange("grid")}
                                    aria-label="Grid view"
                                >
                                    <LayoutGridIcon className="size-4" />
                                </Button>
                            </div>
                        )}
                        {search}
                    </div>
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    )
}


interface EntitySearchProps {
    value: string,
    onChange: (value: string) => void,
    placeholder?: string,
}

export const EntitySearch = ({
    value,
    onChange,
    placeholder = "Search...",
}: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="max-w-[200px] bg-background shadow-none border-border pl-8"
            />
        </div>
    )
}


interface EntityPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const EntityPagination = ({
    page,
    totalPages,
    onPageChange,
    disabled,
}: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(Math.max(1 , page - 1))}
                    disabled={page === 1 || disabled || !totalPages}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(Math.min(totalPages , page + 1))}
                    disabled={page === totalPages || disabled || !totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
};


interface StateViewProps{
    message?: string;
}

interface LoadingViewProps extends
StateViewProps{
    entity?: string;
}

export const LoadingView = ({
    entity = "items",
    message,
}: LoadingViewProps) => {
    return (
        <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon
            className="size-6 animate-spin text-primary"
            />
            <p className="text-sm text-muted-foreground">{message || `Loading ${entity}...`}</p>
        </div>
    )
}



export const ErrorView = ({
    message,
}: StateViewProps) => {
    return (
        <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon
            className="size-6  text-primary"
            />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

interface EmptyViewProps extends StateViewProps{
    onNew? : () => void;
}

export const EmptyView = ({
    message,
    onNew,
}: EmptyViewProps) => {
    return (
        <Empty className="border border-dashed bg-white">
            <EmptyHeader>
               <EmptyMedia variant="icon">
                <PackageOpenIcon/>
               </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>
                No items found
            </EmptyTitle>
            {!!message && <EmptyDescription>{message}</EmptyDescription>}
            {!!onNew && (
                <EmptyContent>
                    <Button onClick={onNew}>Add item</Button>
                </EmptyContent>
            )}
        </Empty>
    )
}

interface EntityListProps<T>{
    items: T[];
    renderItem: (item: T , index: number) => React.ReactNode;
    getKey?: (item: T , index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string;
    viewMode?: ViewMode;
}

export const EntityList = <T,>({
    items ,
    renderItem ,
    getKey , 
    emptyView , 
    viewMode = "list",
    className}: EntityListProps<T>) => {
    if(items.length === 0 && emptyView){
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-sm mx-auto">
                    {emptyView}
                </div>
            </div>
        )
    }
    return (
        <div className={cn(
            viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-y-4",    
            className
        )}>
            {items.map((item , index) => (
                <div key={getKey ? getKey(item , index) : index}>
                    {renderItem(item , index)}
                </div>
            ))}
        </div>
    )
}


interface EntityItemProps{
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className,
}: EntityItemProps) => {

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if(isRemoving) return ;

        if(onRemove){
            await onRemove();
        }
    }

    return (
        <Link href={href} prefetch>
            <Card className={cn(
                "p-4 shadow-none hover:shadow cursor-pointer",
                isRemoving && "opacity-50 cursor-not-allowed",
                className
            )}>
                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium">{title}</CardTitle>
                            {!!subtitle && <CardDescription className="text-sm">{subtitle}</CardDescription>}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className="flex gap-4 items-center">
                            {actions}
                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"
                                         disabled={isRemoving}
                                         onClick={(e) => e.stopPropagation()}
                                         >
                                            <MoreVerticalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end"
                                     onClick={(e)=>e.stopPropagation()}
                                    >
                                        <DropdownMenuItem onClick={handleRemove} disabled={isRemoving}>
                                            <TrashIcon className="size-4 text-red-500" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}


interface EntityGridItemProps{
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

export const EntityGridItem = ({
    href,
    title,
    subtitle,
    image,
    onRemove,
    isRemoving,
    className,
}: EntityGridItemProps) => {

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if(isRemoving) return ;

        if(onRemove){
            await onRemove();
        }
    }

    return (
        <Link href={href} prefetch>
            <Card className={cn(
                "p-0 shadow-none hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden h-full group",
                isRemoving && "opacity-50 cursor-not-allowed",
                className
            )}>
                {/* Colored top accent bar */}
                <div className="h-24 bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 flex items-center justify-center relative">
                    <div className="size-12 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-sm">
                        {image}
                    </div>
                    {/* Kebab menu top-right */}
                    {onRemove && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"
                                     className="size-7 bg-background/70 backdrop-blur-sm hover:bg-background"
                                     disabled={isRemoving}
                                     onClick={(e) => e.stopPropagation()}
                                     >
                                        <MoreVerticalIcon className="size-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end"
                                 onClick={(e)=>e.stopPropagation()}
                                >
                                    <DropdownMenuItem onClick={handleRemove} disabled={isRemoving}>
                                        <TrashIcon className="size-4 text-red-500" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>
                    {!!subtitle && <CardDescription className="text-xs mt-1 line-clamp-2">{subtitle}</CardDescription>}
                </CardContent>
            </Card>
        </Link>
    )
}