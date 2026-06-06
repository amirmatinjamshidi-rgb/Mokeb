/** Figma-aligned layout & color tokens — General reservation / Page of site */

export const SITE_MAX = 1440;
/** Mobile hero min height (Figma `General reservation-1-M`). */
export const HERO_H_MOBILE = 360;
export const CONTROL_H = 56;
export const FORM_ROW_MAX = 1072;

export const colors = {
  primary08: "#175E47",
  primary07: "#1F7E5F",
  primary06: "#279F78",
  neutral08: "#61756F",
  neutral09: "#586A64",
  neutral04: "#8A9E98",
  backgroundW: "#FFFFFF",
  background07: "#F5F9F6",
  background02: "#FAFAFA",
  warning05: "#D8B648",
  warning06: "#D4AF37",
  warning03: "#DFC369",
  goldLine: "#DBBC59",
  footerGreen: "#5c937d",
  error07: "#D22B23",
} as const;

export const shadows = {
  s: "0px 2px 4px rgba(0,0,0,0.12)",
  m: "0px 4px 12px rgba(0,0,0,0.14)",
} as const;
