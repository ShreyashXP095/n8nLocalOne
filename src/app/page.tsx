import prisma from "@/lib/ds"

const page = async () =>{
  const user = await prisma.user.findMany();
return (
  <div className="text-red-500">
    {JSON.stringify(user)}
  </div>
)
}
export default page

// since prisma is not useful for scaling so we'll gonna user a trpc layer for acessing and managing the database
// trpc is a typescript framework that provides type-safe communication between the client and the server