export const getInitialsName = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
    if (!firstName || !lastName) { return ''; }
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
};
