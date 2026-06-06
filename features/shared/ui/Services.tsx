export type ServicesItem = {
  id: number;
  number: string;
  title: string;
  description: string;
};

interface ServicesProps {
  item: ServicesItem;
}

function Services({ item }: ServicesProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center rounded-2xl bg-white p-4 text-center sm:p-6">
      <h3 className="text-lg font-bold leading-snug text-[#61756F] sm:text-xl md:text-2xl">
        <span className="block text-2xl font-bold sm:inline sm:text-inherit">
          {item.number}
        </span>{" "}
        {item.title}
      </h3>
      <p className="mt-2 text-xs leading-6 text-[#61756F] sm:text-sm">
        {item.description}
      </p>
    </div>
  );
}

export default Services;
