export async function searchListings() {
    const response = await fetch('/api/listing');
    return response.json();
}
