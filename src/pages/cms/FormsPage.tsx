import { CrudTable } from "./CrudTable";
const langOpts = [{ value: "en", label: "English" }, { value: "et", label: "Eesti" }];
const typeOpts = ["text", "email", "textarea", "tel", "number"].map((t) => ({ value: t, label: t }));

const FormsPage = () => (
  <CrudTable
    table="form_fields"
    title="Form Fields"
    description="Define fields for the contact form per language."
    orderBy="order"
    columns={[
      { key: "form_key", label: "Form" }, { key: "name", label: "Name" },
      { key: "label", label: "Label" }, { key: "type", label: "Type" },
      { key: "language", label: "Lang" }, { key: "required", label: "Required" },
    ]}
    fields={[
      { name: "form_key", label: "Form key", required: true },
      { name: "name", label: "Field name (id)", required: true },
      { name: "label", label: "Label", required: true },
      { name: "type", label: "Type", type: "select", options: typeOpts, required: true },
      { name: "language", label: "Language", type: "select", options: langOpts, required: true },
      { name: "order", label: "Order", type: "number" },
      { name: "required", label: "Required", type: "boolean" },
    ]}
  />
);
export default FormsPage;
