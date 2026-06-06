"use client";
import AbilityCard, { type AbilityCardItem } from "@/features/shared/ui/Ability";
import { ConciergeBell, UsersRound, Waypoints, HandHeart } from "lucide-react";
const AbilityCards = [
    {
        id: 1,
        icon: <UsersRound stroke="#D8B648" />,
        title: "اسکان زائرین",
        info: "فضای مناسب استراحت با رعایت بهداشت و نظم",
    },
    {
        id: 2,
        icon: <ConciergeBell stroke="#D8B648" />,
        title: "تغذیه گرم",
        info: "طبخ و توزیع غذای گرم در ایام مشخص",
    },
    {
        id: 3,
        icon: <Waypoints stroke="#D8B648" />,
        title: "راهنمایی زائرین",
        info: "راهنمای مسیر، زمان حرکت و نظم‌دهی",
    },
    {
        id: 4,
        icon: <HandHeart stroke="#D8B648" />,
        title: "مشارکت مردمی",
        info: "پذیرش نذورات و همکاری خادمین داوطلب",
    },
]
export default function AbilityCardList() {
    return (
        <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AbilityCards.map((item: AbilityCardItem) => (
                <AbilityCard key={item.id} item={item} />
            ))}
        </div>
    )
}