import Edit from "@/components/Article/edit/Edit"




export default async function page({ params }) {
  const { id } = await params;
  

  return (
      <div>
          <Edit id={id} />
      </div>
  );
}

