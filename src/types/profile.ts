export type ProfileItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
  type?: "link" | "toggle";
  enabled?: boolean;
};
