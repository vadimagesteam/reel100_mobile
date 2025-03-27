export interface DropdownItem {
    label: string;
    value: string | null;
}

export interface DropdownMenuProps {
    data: DropdownItem[];
    placeholder?: string;
    onSelect?: (value: string | null) => void;
    selectedValue?: string | null;
}
