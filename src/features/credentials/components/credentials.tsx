"use client";

import { formatDistanceToNow } from "date-fns";

import { EmptyView, EntityContainer, EntityGridItem, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView, type ViewMode } from "@/components/entity-components";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/browser";
import { CredentialType } from "@/generated/prisma/browser";
import Image from "next/image";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const VIEW_MODE_KEY = "nodeflow-credentials-view";

function getInitialViewMode(): ViewMode {
    if (typeof window === "undefined") return "grid";
    try {
        const stored = localStorage.getItem(VIEW_MODE_KEY);
        if (stored === "list" || stored === "grid") return stored;
    } catch {}
    return "grid";
}

const viewModeAtom = atom<ViewMode>(getInitialViewMode());

function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
    const [viewMode, setViewModeState] = useAtom(viewModeAtom);

    const setViewMode = useCallback((mode: ViewMode) => {
        setViewModeState(mode);
        try {
            localStorage.setItem(VIEW_MODE_KEY, mode);
        } catch {}
    }, [setViewModeState]);

    return [viewMode, setViewMode];
}

export const CredentialsSearch = () =>{

    const [params , setParams] = useCredentialsParams();
    const {searchValue , onSearchChange} = useEntitySearch({
        params,
        setParams,
        debounceMs: 500,
    })

    return (
        <EntitySearch
        value = {searchValue}
        onChange={onSearchChange}
        placeholder="Search credentials"
        />
    )
}


export const CredentialsList = () =>{
    const credentials = useSuspenseCredentials();
    const [viewMode] = useViewMode();

   return (
    <EntityList
    items={credentials.data.items}
    getKey = {(credential) => credential.id}
    viewMode={viewMode}
    renderItem={(credential) => (
        viewMode === "grid" ? (
            <CredentialGridItem key={credential.id} data={credential} />
        ) : (
            <CredentialItem key={credential.id} data={credential} />
        )
    )}
    emptyView={<CredentialsEmpty />}
    />
   )
}

export const CredentialsHeader  = ({disabled} : {disabled?: boolean}) =>{

    return (

        <EntityHeader
        title="Credentials"
        description="Create and manage your credentials"
        newButtonLabel="New Credential"
        disabled={disabled}
        newButtonHref="/credentials/new"
        />
    )

}

export const CredentialsPagination = () => {
    const [params , setParams] = useCredentialsParams();
    const credentials  = useSuspenseCredentials();

    return (
        <EntityPagination
        disabled = {credentials.isFetching}
        page={credentials.data?.page}
        totalPages={credentials.data?.totalPages}
        onPageChange={(page) => setParams({...params , page})}
        />
    )
}
export const CredentialsContainer = ({children} : {children: React.ReactNode}) => {
    const [viewMode, setViewMode] = useViewMode();

    return (
       <EntityContainer 
       header = {<CredentialsHeader />}
       search = {<CredentialsSearch />}
       pagination = {<CredentialsPagination />}
       viewMode={viewMode}
       onViewModeChange={setViewMode}
       >
        {children}
       </EntityContainer>
    )
}


export const CredentialsLoading = () => {
    return (
            <LoadingView
            message="Loading credentials..."
            />
    )
}

export const CredentialsError = () => {
    return (
            <ErrorView
            message="Failed to load credentials"
            />
    )
}

export const CredentialsEmpty = () => {

    const router = useRouter();

    const handleCreate = () =>{
        router.push(`/credentials/new`);
    }

    return (
    
            <EmptyView
            message="Get Started by creating your first credential"
            onNew={handleCreate}
            />
    )
}

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.GEMINI]: "/logos/gemini.svg",
    [CredentialType.OPENAI]: "/logos/openai.svg",
    [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
    [CredentialType.GROQ]: "/logos/groq.svg",
}

export const CredentialItem = ({
   data,
}: {
   data: Credential
}) => {
    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({id: data.id})
    }

    const logo = credentialLogos[data.type] || "/logos/gemini.svg";

    return (
        <EntityItem
        key={data.id}
        href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt , {addSuffix: true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt , {addSuffix: true})}
            </>
        }
        image = {
            <div className="size-8 flex items-center justify-center">
                <Image
                src={logo}
                alt={data.name}
                width={20}
                height={20}
                />
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeCredential.isPending}
        />
    )
}

export const CredentialGridItem = ({
   data,
}: {
   data: Credential
}) => {
    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({id: data.id})
    }

    const logo = credentialLogos[data.type] || "/logos/gemini.svg";

    return (
        <EntityGridItem
        href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt , {addSuffix: true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt , {addSuffix: true})}
            </>
        }
        image = {
            <Image
            src={logo}
            alt={data.name}
            width={24}
            height={24}
            />
        }
        onRemove={handleRemove}
        isRemoving={removeCredential.isPending}
        />
    )
}