interface MenuItem {
    name: string;
    url: string;
    icon: string;
    children?: MenuItem[];
}
export type { MenuItem };