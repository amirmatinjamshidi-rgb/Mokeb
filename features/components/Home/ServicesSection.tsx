"use client";
import Services, { type ServicesItem } from "@/features/UI/Services";
const ServicesStuff = [
        {
            id: 1,
            number: "۹",
            title: " سال خدمت‌رسانی مستمر",
            description: "از سال ۱۳۹۵ تا امروز",
        },
        {
            id: 2,
            number: "۱۰۰۰",
            title: " نفر ظرفیت اسکان",
            description: "فضای مناسب استراحت با رعایت بهداشت و نظم",
        },
        {
            id: 3,
            number: "۱۰٬۰۰۰",
            title: " پرس غذا در هر وعده",
            description: "در هر وعده در ایام پیک",
        },
    ]
export default function ServicesSection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mx-auto justify-center items-center">
            {ServicesStuff.map((item: ServicesItem) => (
                <Services key={item.id} item={item} />
            ))}
        </div>
    )
}