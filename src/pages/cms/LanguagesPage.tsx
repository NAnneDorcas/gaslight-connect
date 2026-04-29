import { CrudTable } from "./CrudTable";

const LanguagesPage = () => (
  <CrudTable
    table="site_config"
    title="Languages"
    description="Configure enabled languages and default language."

    columns={[
      { key: "team_slug", label: "Team" },
      { key: "default_language", label: "Default Language" },
      { key: "enabled_languages", label: "Enabled Languages" },
      { key: "updated_at", label: "Updated" },
    ]}

    fields={[
      {
        name: "team_slug",
        label: "Team Slug",
        required: true,
      },

      {
        name: "default_language",
        label: "Default Language",
        type: "select",
        options: [
          { value: "en", label: "English" },
          { value: "et", label: "Eesti" },
        ],
        required: true,
      },

      {
        name: "enabled_languages",
        label: "Enabled Languages (JSON array)",
        type: "textarea",
      },
    ]}
  />
);

export default LanguagesPage;