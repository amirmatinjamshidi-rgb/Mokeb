import React from 'react'

export type ServicesItem = {
    id: number;
    number: string;
    title: string;
    description: string;
   
} 
interface ServicesProps {
    item: ServicesItem;
}
function Services({ item }: ServicesProps) {
  return (
    <div key={item.id} className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 w-full text-center">
      <h3 className="text-2xl font-bold leading-tight text-gray-500">
        <span className="text-2xl text-grayScale">{item.number}</span>
        {item.title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 text-grayScale">{item.description}</p>
    </div>
  )
}

export default Services