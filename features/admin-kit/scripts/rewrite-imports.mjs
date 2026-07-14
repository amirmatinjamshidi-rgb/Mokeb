import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = join(import.meta.dirname, "..");

const replacements = [
  [/@\/features\/lib\/utils/g, "@admin-kit/shared/lib/utils"],
  [/@\/features\/lib\/format/g, "@admin-kit/shared/lib/format"],
  [/@\/features\/lib\/layout/g, "@admin-kit/shared/lib/layout"],
  [/@\/features\/lib\/inputValidation/g, "@admin-kit/shared/lib/inputValidation"],
  [/@\/features\/lib\/formInputFilters/g, "@admin-kit/shared/lib/formInputFilters"],
  [/@\/features\/lib\/formZodRules/g, "@admin-kit/schemas/formZodRules"],
  [/@\/features\/lib\/profileSchema/g, "@admin-kit/schemas/profileSchema"],
  [/@\/features\/reservation\/tokens/g, "@admin-kit/shared/tokens"],
  [/@\/features\/tokens/g, "@admin-kit/shared/tokens"],
  [/@\/features\/types/g, "@admin-kit/shared/types"],
  [/@\/features\/config\/navigation/g, "@admin-kit/navigation/routes"],
  [/@\/features\/config\/nav/g, "@admin-kit/navigation/nav"],
  [/@\/features\/UI\/button/g, "@admin-kit/ui/Button"],
  [/@\/features\/UI\/IconLabelInput/g, "@admin-kit/ui/IconLabelInput"],
  [/@\/features\/UI\/InputValidTick/g, "@admin-kit/ui/InputValidTick"],
  [/@\/features\/UI\/FloationgLabelSearch/g, "@admin-kit/ui/FloatingLabelSearch"],
  [/@\/features\/components\/FormTextInput/g, "@admin-kit/ui/FormTextInput"],
  [/@\/features\/components\/Table\/MainTable/g, "@admin-kit/table/MainTable"],
  [/@\/features\/components\/Table\/ablePagination/g, "@admin-kit/table/TablePagination"],
  [/@\/features\/components\/Table\/TableActionsMenu/g, "@admin-kit/table/TableActionsMenu"],
  [/@\/features\/components\/KarvanReservation\/ReservationFilters/g, "@admin-kit/dropdowns/ReservationFilters"],
  [/@\/features\/components\/AddKarevan\/FormSchemas/g, "@admin-kit/schemas/supervisorFormSchemas"],
  [/@\/features\/components\/AddKarevan\/registerboxformComponents\/addkarvanForminfo/g, "@admin-kit/forms/supervisor/PilgrimInfoForm"],
  [/@\/features\/components\/AddKarevan\/step1\/AddKarvanSupervisorStep/g, "@admin-kit/forms/supervisor/SupervisorStep"],
  [/@\/features\/components\/AddKarevan\/registerboxformComponents\/SiteReservationContentRow/g, "@admin-kit/forms/supervisor/SiteReservationContentRow"],
  [/@\/features\/components\/Settings\/karvanInformationSchema/g, "@admin-kit/schemas/karvanInformationSchema"],
  [/@\/features\/components\/Settings\/BOX-CLASSES\/settingsSectionBox/g, "@admin-kit/settings/box-classes/settingsSectionBox"],
  [/@\/features\/components\/Settings\/BOX-CLASSES\/Informationbox/g, "@admin-kit/settings/box-classes/Informationbox"],
  [/@\/features\/components\/ManagementSchema/g, "@admin-kit/schemas/managementSchema"],
  [/@\/features\/components\/ManagementViewModal/g, "@admin-kit/modals/ViewModal"],
  [/@\/features\/components\/ZaerManagement\/ZaerManagementFormModal/g, "@admin-kit/modals/FormModal"],
  [/@\/features\/components\/ProfileFormFields/g, "@admin-kit/forms/ProfileFormFields"],
  [/\.\.\/\.\.\/lib\/profileSchema/g, "@admin-kit/schemas/profileSchema"],
  [/\.\.\/lib\/profileSchema/g, "@admin-kit/schemas/profileSchema"],
  [/\.\.\/lib\/formZodRules/g, "@admin-kit/schemas/formZodRules"],
  [/\.\/formZodRules/g, "@admin-kit/schemas/formZodRules"],
  [/\.\.\/types/g, "@admin-kit/shared/types"],
  [/\.\.\/config\/nav/g, "@admin-kit/navigation/nav"],
  [/\.\.\/reservation\/store\/UseAuthStore/g, "@admin-kit/shared/store/authStore"],
  [/\.\/UsePanelShell/g, "@admin-kit/layouts/PanelShell"],
  [/\.\/UserPanelGate/g, "@admin-kit/layouts/PanelGate"],
  [/\.\/SideBarNav/g, "@admin-kit/layouts/SidebarNav"],
  [/\.\/NavBar/g, "@admin-kit/layouts/NavBar"],
  [/\.\/ManagementSchema/g, "@admin-kit/schemas/managementSchema"],
  [/\.\.\/ManagementViewModal/g, "@admin-kit/modals/ViewModal"],
  [/\.\/ZaerManagementFormModal/g, "@admin-kit/modals/FormModal"],
  [/\.\.\/ManagementSchema/g, "@admin-kit/schemas/managementSchema"],
  [/\.\.\/\.\.\/lib\/profileSchema/g, "@admin-kit/schemas/profileSchema"],
  [/\.\.\/Settings\/modiriatKarvan/g, "@admin-kit/settings/RepresentativeSection"],
  [/\.\.\/Settings\/KarvanInformationSection/g, "@admin-kit/settings/KarvanInformationSection"],
  [/\.\.\/Settings\/UserInfo/g, "@admin-kit/settings/UserInfo"],
  [/\.\.\/Settings\/SettingsSections/g, "@admin-kit/settings/SettingsSections"],
  [/\.\.\/FormSchemas/g, "@admin-kit/schemas/supervisorFormSchemas"],
  [/\.\.\/useReservationCapacityStore/g, "@admin-kit/forms/supervisor/useSupervisorFormStore"],
  [/\.\.\/FormSchemas/g, "@admin-kit/schemas/supervisorFormSchemas"],
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "scripts") continue;
      walk(p, files);
    } else if ([".ts", ".tsx"].includes(extname(name))) {
      files.push(p);
    }
  }
  return files;
}

let count = 0;
for (const file of walk(ROOT)) {
  let content = readFileSync(file, "utf8");
  const original = content;
  for (const [from, to] of replacements) {
    content = content.replace(from, to);
  }
  if (content !== original) {
    writeFileSync(file, content, "utf8");
    count++;
  }
}
console.log(`Rewrote imports in ${count} files`);
