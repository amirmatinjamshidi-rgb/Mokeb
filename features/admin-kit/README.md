# Admin Kit — portable UI package

Self-contained folder copied from **mokeb-boss** for reuse in a separate admin-panel repo.

Move the entire `admin-kit/` directory into your new project, then wire the path alias below.

---

## Folder map

| Folder | Contents |
|--------|----------|
| `layouts/` | Sidebar, Navbar, panel shell, auth gate |
| `navigation/` | `ROUTES` + sidebar `ADMIN_PANEL_NAV` |
| `ui/` | Button, inputs (`IconLabelInput`, `FormTextInput`, …) |
| `dropdowns/` | Native `FilterSelect`, custom `ListboxSelect`, `ReservationFilters` |
| `schemas/` | Zod rules, profile, supervisor (سرپرست), settings, management |
| `forms/supervisor/` | `PilgrimInfoForm`, `SupervisorStep`, store |
| `table/` | Dynamic `Table`, row actions menu, pagination + hook |
| `settings/` | Section tab changer + settings panels |
| `modals/` | `BaseModal`, `FormModal`, `ViewModal`, `useModalState` |
| `shared/` | `cn`, format helpers, tokens, types, auth store |
| `examples/` | Drop-in usage samples |

---

## 1. Copy into new repo

```bash
cp -r admin-kit /path/to/new-admin-repo/
```

Optional public assets (copy to `public/` in the new repo):

- `Logo-white.png`
- `profile-panel.jpg`

---

## 2. TypeScript path alias

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@admin-kit/*": ["./admin-kit/*"]
    }
  }
}
```

Next.js also needs the same alias in `next.config.ts` if you use Turbopack/webpack path resolution.

---

## 3. NPM dependencies

```bash
bun add clsx tailwind-merge zod react-hook-form @hookform/resolvers zustand lucide-react @mui/material @mui/icons-material
```

Also required: **Next.js** (`next/navigation`, `next/image`, `next/link`), **React 19**, **Tailwind CSS v4**.

---

## 4. Tailwind / CSS tokens

Copy these from the source `app/globals.css` `@theme` block into your admin app:

- `--color-primaryBorder` (used by `Table`)
- `max-w-site`, `max-w-form-row` if you use layout helpers

Minimum table border utility used by `MainTable`:

```css
@theme {
  --color-primaryBorder: #e5e7eb;
}
```

---

## 5. Quick start — layout

```tsx
// app/layout.tsx
import { AdminPanelLayoutClient } from "@admin-kit/layouts/PanelLayoutClient";

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AdminPanelLayoutClient>{children}</AdminPanelLayoutClient>
      </body>
    </html>
  );
}
```

Edit sidebar links in `admin-kit/navigation/nav.ts` and routes in `admin-kit/navigation/routes.ts`.

---

## 6. Component cheat sheet

### Sidebar + Navbar
- `SidebarNav` — `layouts/SidebarNav.tsx`
- `PanelShell` — sidebar + navbar + mobile drawer
- `ADMIN_PANEL_NAV` — `navigation/nav.ts`

### Buttons & inputs
```tsx
import Button from "@admin-kit/ui/Button";
import { IconLabelInput } from "@admin-kit/ui/IconLabelInput";
import FormTextInput from "@admin-kit/ui/FormTextInput";
```

### Dropdowns
```tsx
import { FilterSelect } from "@admin-kit/dropdowns/FilterSelect";       // native select
import { ListboxSelect } from "@admin-kit/dropdowns/ListboxSelect";     // custom listbox
```

### Supervisor form (سرپرست)
```tsx
import { SupervisorStep } from "@admin-kit/forms/supervisor/SupervisorStep";
import { useSupervisorFormStore } from "@admin-kit/forms/supervisor/useSupervisorFormStore";

// Optional: handle submit in parent
useSupervisorFormStore.getState().setOnSupervisorSubmit((data) => {
  console.log(data);
});
```

### Dynamic table + pagination
```tsx
import { Table, type Column } from "@admin-kit/table/MainTable";
import { TablePagination, usePagination } from "@admin-kit/table/TablePagination";
import { TableRowActionsMenu } from "@admin-kit/table/TableActionsMenu";
```

### Settings section changer
```tsx
import { SettingsSections, type SettingsSectionId } from "@admin-kit/settings/SettingsSections";
```

### Modals
```tsx
import { BaseModal } from "@admin-kit/modals/BaseModal";
import { FormModal } from "@admin-kit/modals/FormModal";
import { ViewModal } from "@admin-kit/modals/ViewModal";
import { useFormAndViewModals } from "@admin-kit/modals/useModalState";

const { formOpen, openForm, closeForm, viewTarget, openView, closeView } =
  useFormAndViewModals<YourRowType>();
```

### Schemas
```tsx
import { zIranMobile, zTextNoDigits } from "@admin-kit/schemas/formZodRules";
import { profileSchema } from "@admin-kit/schemas/profileSchema";
import { pilgrimSchema } from "@admin-kit/schemas/supervisorFormSchemas";
import { karvanInformationSchema } from "@admin-kit/schemas/karvanInformationSchema";
```

---

## 7. Barrel import

```tsx
import { Button, Table, SettingsSections, SupervisorStep } from "@admin-kit/index";
```

---

## 8. Examples

See `examples/`:

- `PanelLayout.example.tsx` — root layout
- `SettingsPage.example.tsx` — settings tabs
- `TableWithPagination.example.tsx` — table + modals

---

## Notes

- All internal imports use `@admin-kit/*` — no dependency on `@/features` from the old repo.
- `PilgrimInfoForm` uses MUI `Select` / `RadioGroup` with tokens from `shared/tokens.ts`.
- `FormModal` is generic — pass your own RHF fields as `children` (no `ProfileFormFields` bundled).
- `useAuthStore` is a minimal Zustand mock; replace with your real auth in the admin repo.
