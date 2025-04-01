export const getStateFromCoords = async (latitude: number, longitude: number) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=5&addressdetails=1`
        );
        const data = await response.json();
        return data.address?.state || null;
    } catch (error) {
        console.error('Error fetching state from Nominatim:', error);
        return null;
    }
};
