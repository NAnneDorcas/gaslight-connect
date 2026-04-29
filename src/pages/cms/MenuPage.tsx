import { CrudTable } from "./CrudTable";
const langOpts = [{ value: "en", label: "English" }, { value: "et", label: "Eesti" }];

const MenuPage = () => (
  <CrudTable
    table="menu_items"
    title="Menu"
    description="Top navigation links for each language."
    orderBy="order"
    columns={[
      { key: "label", label: "Label" }, { key: "url", label: "URL" },
      { key: "language", label: "Lang" }, { key: "order", label: "Order" },
      { key: "enabled", label: "Enabled" },
    ]}
    fields={[
      { name: "label", label: "Label", required: true },
      { name: "url", label: "URL", required: true },
      { name: "language", label: "Language", type: "select", options: langOpts, required: true },
      { name: "order", label: "Order", type: "number" },
      { name: "enabled", label: "Enabled", type: "boolean" },
    ]}
  />
);
export default MenuPage;
