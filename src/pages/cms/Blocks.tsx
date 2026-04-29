import { CrudTable } from "./CrudTable";

const langOpts = [{ value: "en", label: "English" }, { value: "et", label: "Eesti" }];

const Blocks = () => (
  <CrudTable
    table="content_blocks"
    title="Content Blocks"
    description="Edit hero, about, offer and contact section text per language."
    orderBy="key"
    columns={[
      { key: "key", label: "Key" },
      { key: "language", label: "Lang" },
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
    ]}
    fields={[
      { name: "key", label: "Key (e.g. hero, about, offer_1)", required: true },
      { name: "language", label: "Language", type: "select", options: langOpts, required: true },
      { name: "title", label: "Title" },
      { name: "subtitle", label: "Subtitle" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "image_url", label: "Image URL" },
      { name: "order", label: "Order", type: "number" },
    ]}
  />
);
export default Blocks;
