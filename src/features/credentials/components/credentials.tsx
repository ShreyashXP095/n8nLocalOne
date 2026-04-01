"use client";

import { formatDistanceToNow } from "date-fns";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/browser";
import { CredentialType } from "@/generated/prisma/browser";
import Image from "next/image";

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

   return (
    <EntityList
    items={credentials.data.items}
    getKey = {(credential) => credential.id}
    renderItem={(credential) => (
        <CredentialItem key={credential.id} data={credential} />
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
    return (
       <EntityContainer 
       header = {<CredentialsHeader />}
       search = {<CredentialsSearch />}
       pagination = {<CredentialsPagination />}
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