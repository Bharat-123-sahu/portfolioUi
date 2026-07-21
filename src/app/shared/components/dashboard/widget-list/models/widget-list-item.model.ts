export interface WidgetListItem {
    [x: string]: any;

    id: string;

    title: string;

    subtitle?: string;

    image?: string;

    icon?: string;

    badge?: string;

    badgeColor?: string;

    date?: Date;

    route?: string;

    disable?: boolean

}