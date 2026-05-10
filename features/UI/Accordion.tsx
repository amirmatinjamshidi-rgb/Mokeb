"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type AccordionItem = {
  question: string;
  answer: string;
};

interface AccordionListProps {
  items: AccordionItem[];
}

export default function MiniAccordionList({ items }: AccordionListProps) {
  return (
    <div className="w-full space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border w-full  backdrop-blur-sm overflow-hidden"
        >
          <Accordion
            elevation={0}
            disableGutters
            className="bg-transparent! "
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className="tex-shadow-gray-400 min-h-[60px]" />}
              aria-controls={`panel-${i}`}
              id={`panel-${i}`}
              className="min-h-16"
            >
              <Typography
                component="span"
                className="flex items-center gap-3 font-bold text-sm sm:text-base"
              >
              
                {item.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails className="bg-textOnText">
              <Typography className="text-sm sm:text-base leading-relaxed text-gray-700">
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
