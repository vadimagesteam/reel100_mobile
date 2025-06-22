export interface DropdownItem {
    label: string;
    slug: string | null;
    id: string;
}

export interface DropdownMenuProps {
    data: DropdownItem[];
    placeholder?: string;
    onSelect?: (value: string | null) => void;
    selectedValue?: string | null;
}
