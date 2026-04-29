import { CrudTable } from "./CrudTable";

const langOpts = [
  { value: "en", label: "English" },
  { value: "et", label: "Eesti" },
];

const typeOpts = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "About" },
  { value: "offers", label: "Offers" },
  { value: "contact", label: "Contact" },
  { value: "footer", label: "Footer" },
];

const Blocks = () => (
  <CrudTable
    table="blocks"
    title="Content Blocks"
    description="Edit hero, about, offers, contact, and footer content per language."

    orderBy="sort_order"

    columns={[
      { key: "type", label: "Type" },
      { key: "language", label: "Lang" },
      { key: "title", label: "Title" },
      { key: "sort_order", label: "Order" },
      { key: "hidden", label: "Hidden" },
      { key: "updated_at", label: "Updated" },
    ]}

    fields={[
      {
        name: "team_slug",
        label: "Team Slug",
        required: true,
      },

      {
        name: "language",
        label: "Language",
        type: "select",
        options: langOpts,
        required: true,
      },

      {
        name: "type",
        label: "Block Type",
        type: "select",
        options: typeOpts,
        required: true,
      },

      {
        name: "title",
        label: "Title",
      },

      {
        name: "body",
        label: "Body",
        type: "textarea",
      },

      {
        name: "button_label",
        label: "Button Label",
      },

      {
        name: "button_target",
        label: "Button Target",
      },

      {
        name: "items",
        label: "Offer Items JSON",
        type: "textarea",
      },

      {
        name: "styles",
        label: "Styles JSON",
        type: "textarea",
      },

      {
        name: "sort_order",
        label: "Sort Order",
        type: "number",
      },

      {
        name: "hidden",
        label: "Hidden",
        type: "boolean",
      },
    ]}
  />
);

export default Blocks;