# Admin Kit — file manifest

## layouts/
| File | Source | Purpose |
|------|--------|---------|
| `SidebarNav.tsx` | `features/layouts/SideBarNav.tsx` | Sidebar links + active route |
| `NavBar.tsx` | `features/layouts/NavBar.tsx` | Top bar search + profile |
| `PanelShell.tsx` | `features/layouts/UsePanelShell.tsx` | Sidebar + navbar shell |
| `PanelGate.tsx` | `features/layouts/UserPanelGate.tsx` | Auth gate (optional) |
| `PanelLayoutClient.tsx` | `features/layouts/BossPanelLayoutClient.tsx` | Layout wrapper |

## navigation/
| File | Purpose |
|------|---------|
| `routes.ts` | Global `ROUTES` constants |
| `nav.ts` | `ADMIN_PANEL_NAV` sidebar items |

## ui/
| File | Purpose |
|------|---------|
| `Button.tsx` | Shared button variants |
| `IconLabelInput.tsx` | Icon + validation tick input |
| `InputValidTick.tsx` | Green check icon |
| `FloatingLabelSearch.tsx` | Floating label search |
| `FormTextInput.tsx` | RHF text input with filters |

## dropdowns/
| File | Purpose |
|------|---------|
| `FilterSelect.tsx` | Native `<select>` (pagination) |
| `ListboxSelect.tsx` | Custom listbox dropdown |
| `ReservationFilters.tsx` | Filter bar with listbox selects |

## schemas/
| File | Purpose |
|------|---------|
| `formZodRules.ts` | `zIranMobile`, `zTextNoDigits`, … |
| `profileSchema.ts` | Profile / accompany form schema |
| `supervisorFormSchemas.ts` | سرپرست / pilgrim schema |
| `karvanInformationSchema.ts` | Settings caravan section |
| `managementSchema.ts` | Table row types + label helpers |

## forms/supervisor/
| File | Purpose |
|------|---------|
| `PilgrimInfoForm.tsx` | Full سرپرست field UI |
| `SupervisorStep.tsx` | Form wrapper + submit |
| `useSupervisorFormStore.ts` | Zustand draft state |
| `SiteReservationContentRow.tsx` | Layout helpers |

## table/
| File | Purpose |
|------|---------|
| `MainTable.tsx` | Generic CSS-grid table |
| `TableActionsMenu.tsx` | Row ellipsis menu |
| `TablePagination.tsx` | Pagination bar + `usePagination` |

## settings/
| File | Purpose |
|------|---------|
| `SettingsSections.tsx` | Tab section changer |
| `KarvanInformationSection.tsx` | Caravan info form |
| `UserInfo.tsx` | Login info panel |
| `RepresentativeSection.tsx` | Representative fields |
| `box-classes/*.ts` | Shared Tailwind box classes |

## modals/
| File | Purpose |
|------|---------|
| `BaseModal.tsx` | Overlay + panel shell |
| `FormModal.tsx` | Generic form modal |
| `ViewModal.tsx` | Read-only detail modal |
| `useModalState.ts` | `useModalState`, `useFormAndViewModals` |

## shared/
| Path | Purpose |
|------|---------|
| `lib/utils.ts` | `cn()` |
| `lib/format.ts` | Persian digits, dates |
| `lib/layout.ts` | Page layout class strings |
| `lib/inputValidation.ts` | Valid tick helper |
| `lib/formInputFilters.ts` | Digit/text filters |
| `tokens.ts` | Colors, `CONTROL_H` |
| `types.ts` | `NavItem`, `UserProfile`, … |
| `store/authStore.tsx` | Mock auth Zustand store |

## examples/
| File | Purpose |
|------|---------|
| `PanelLayout.example.tsx` | Root layout wiring |
| `SettingsPage.example.tsx` | Settings tabs demo |
| `TableWithPagination.example.tsx` | Table + modal demo |
