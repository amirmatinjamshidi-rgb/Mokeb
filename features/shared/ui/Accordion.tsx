"use client";

import { useState } from "react";
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

const SUMMARY_MIN_H = 64;

export default function MiniAccordionList({ items }: AccordionListProps) {
  /** Only one panel open at a time — avoids paired-row stretch looking like two opens. */
  const [expandedId, setExpandedId] = useState<string | false>(false);

  return (
    <div className="grid w-full grid-cols-1 items-start gap-3 lg:grid-cols-2">
      {items.map((item, i) => {
        const panelId = `faq-panel-${i}`;
        const headerId = `faq-header-${i}`;
        const isExpanded = expandedId === panelId;

        return (
          <div
            key={panelId}
            className="h-fit w-full self-start overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <Accordion
              expanded={isExpanded}
              onChange={(_event, next) => {
                setExpandedId(next ? panelId : false);
              }}
              elevation={0}
              disableGutters
              square
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: "rgb(156 163 175)" }} />
                }
                aria-controls={panelId}
                id={headerId}
                sx={{
                  minHeight: SUMMARY_MIN_H,
                  height: SUMMARY_MIN_H,
                  px: 2,
                  "&.Mui-expanded": {
                    minHeight: SUMMARY_MIN_H,
                    height: SUMMARY_MIN_H,
                  },
                  "& .MuiAccordionSummary-content": {
                    my: 0,
                    alignItems: "center",
                    overflow: "hidden",
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    my: 0,
                  },
                }}
              >
                <Typography
                  component="span"
                  className="line-clamp-2 text-right text-sm font-bold text-gray-700 sm:text-base"
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                id={panelId}
                className="border-t border-gray-100 bg-[#FAFAFA] px-4 py-3"
              >
                <Typography className="text-right text-sm leading-relaxed text-gray-600 sm:text-base">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
