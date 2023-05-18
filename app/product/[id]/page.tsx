import formatPrice from "@/util/PriceFormat";
import Image from "next/image";
import AddCart from "./AddCart";

type SearchParams = {
  name: string;
  unit_amount: number | null;
  image: string;
  id: string;
  description: string | null;
  features: string;
};

type SearchParamsTypes = {
  searchParams: SearchParams;
};

export default async function Product({ searchParams }: SearchParamsTypes) {
  return (
    <div className="flex flex-col new-md:flex-row items-center justify-between gap-16 ">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={400}
        height={400}
        className="w-full h-96 rounded-lg"
        priority={true}
      />

      <div className="font-medium ">
        <h1 className="text-2xl  py-2">{searchParams.name}</h1>
        <p className="py-2">{searchParams.description}</p>
        <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
          <p className="font-bold text-primary">
            {searchParams.unit_amount && formatPrice(searchParams.unit_amount)}
          </p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
}
