import { apiRequest } from "./client";
import type { FaqDto } from "./types";

export async function getFaqs() {
  return apiRequest<FaqDto[]>("/FAQ", { method: "GET" });
}

export async function addFaq(body: { question: string; answer: string }) {
  return apiRequest<FaqDto>("/FAQ", { method: "POST", body });
}

export async function editFaq(
  faqId: string,
  body: { question: string; answer: string },
) {
  return apiRequest<void>(`/FAQ/${faqId}`, { method: "PUT", body });
}
