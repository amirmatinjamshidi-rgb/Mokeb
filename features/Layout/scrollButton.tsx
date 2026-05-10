"use client";
import Button from "../UI/button";
import { useState, useEffect } from "react";
import { ArrowUpAZIcon } from "lucide-react";


const ScrollButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const toggleVisible = () => {
            const scrolled =
                document.documentElement.scrollTop || document.body.scrollTop;
            setVisible(scrolled > 300);
        };

        window.addEventListener("scroll", toggleVisible);
        toggleVisible();

        return () => window.removeEventListener("scroll", toggleVisible);
    }, []);

    const scrollToTop = () => {
        if (typeof window === "undefined") return;
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <Button
            onClick={scrollToTop}
            color="warning"
            radius="lg"
            border="none"
            size="sm"
            text="none"
            className="fixed bottom-6 right-6 p-0 min-w-[50px] w-[50px] h-[50px] shadow-lg z-50"
        >
            <ArrowUpAZIcon color="black" size={24} />
        </Button>
    );
};

export default ScrollButton;
