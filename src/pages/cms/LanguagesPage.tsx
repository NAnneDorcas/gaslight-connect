import { CrudTable } from "./CrudTable";

const LanguagesPage = () => (
  <CrudTable
    table="languages"
    title="Languages"
    description="Site languages available in the switcher."
    columns={[
      { key: "code", label: "Code" }, { key: "name", label: "Name" },
      { key: "is_default", label: "Default" }, { key: "enabled", label: "Enabled" },
    ]}
    fields={[
      { name: "code", label: "Code (e.g. en, et)", required: true },
      { name: "name", label: "Display name", required: true },
      { name: "is_default", label: "Default language", type: "boolean" },
      { name: "enabled", label: "Enabled", type: "boolean" },
    ]}
  />
);
export default LanguagesPage;
