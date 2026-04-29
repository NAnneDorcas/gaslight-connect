import { CrudTable } from "./CrudTable";

const langOpts = [
  { value: "en", label: "English" },
  { value: "et", label: "Eesti" },
];

const typeOpts = [
  { value: "text", label: "text" },
  { value: "email", label: "email" },
  { value: "textarea", label: "textarea" },
  { value: "checkbox", label: "checkbox" },
];

const FormsPage = () => (
  <CrudTable
    table="form_fields"
    title="Form Fields"
    description="Define fields for the public contact form per language."
    orderBy="sort_order"
    columns={[
      { key: "team_slug", label: "Team" },
      { key: "language", label: "Lang" },
      { key: "name", label: "Name" },
      { key: "label", label: "Label" },
      { key: "type", label: "Type" },
      { key: "required", label: "Required" },
      { key: "sort_order", label: "Order" },
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
      { name: "name", label: "Field name", required: true },
      { name: "label", label: "Label", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: typeOpts,
        required: true,
      },
      { name: "required", label: "Required", type: "boolean" },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ]}
  />
);

export default FormsPage;