import formatPrice from "@/util/PriceFormat";
import Image from "next/image";
import Link from "next/link";

type ProductType = {
  key: string;
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  description: string | null;
  quantity?: number | 1;
  metadata: MetaDataType;
};

type MetaDataType = {
  features: string;
};
export default function Product({
  name,
  image,
  unit_amount,
  id,
  metadata,
  description,
}: ProductType) {
  const { features } = metadata;
  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: {
          name,
          id,
          image,
          unit_amount,
          features,
          description,
        },
      }}
    >
      <div className="">
        <Image
          alt={name}
          src={image}
          width={800}
          height={800}
          className="h-96 w-full object-cover rounded-lg"
          priority={true}
        />
        <div className="font-medium py-2">
          <h1>{name}</h1>
          <h2 className="font-sm text-primary ">
            {unit_amount && formatPrice(unit_amount)}
          </h2>
        </div>
      </div>
    </Link>
  );
}
