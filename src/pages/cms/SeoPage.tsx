import { CrudTable } from "./CrudTable";
const langOpts = [{ value: "en", label: "English" }, { value: "et", label: "Eesti" }];

const SeoPage = () => (
  <CrudTable
    table="seo_settings"
    title="SEO"
    description="Page titles, meta descriptions and OG image per language."
    columns={[
      { key: "page", label: "Page" }, { key: "language", label: "Lang" },
      { key: "title", label: "Title" }, { key: "description", label: "Description" },
    ]}
    fields={[
      { name: "page", label: "Page key", required: true },
      { name: "language", label: "Language", type: "select", options: langOpts, required: true },
      { name: "title", label: "Title" },
      { name: "description", label: "Meta description", type: "textarea" },
      { name: "og_image", label: "Open Graph image URL" },
    ]}
  />
);
export default SeoPage;
