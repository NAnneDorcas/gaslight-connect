import { CrudTable } from "./CrudTable";

const langOpts = [
  { value: "en", label: "English" },
  { value: "et", label: "Eesti" },
];

const SeoPage = () => (
  <CrudTable
    table="pages"
    title="SEO"
    description="Edit page title and meta description per language."
    columns={[
      { key: "team_slug", label: "Team" },
      { key: "language", label: "Lang" },
      { key: "title", label: "Title" },
      { key: "meta_description", label: "Meta Description" },
      { key: "updated_at", label: "Updated" },
    ]}
    fields={[
      { name: "team_slug", label: "Team Slug", required: true },
      {
        name: "language",
        label: "Language",
        type: "select",
        options: langOpts,
        required: true,
      },
      { name: "title", label: "Page Title", required: true },
      {
        name: "meta_description",
        label: "Meta Description",
        type: "textarea",
      },
    ]}
  />
);

export default SeoPage;