export interface DrawerItem {
  key: string;
  title: string;
  type: "menu" | "button" | "toggle" | "text";
  icon?: React.ElementType;
  link?: string;
  subList?: React.ReactNode;
}
