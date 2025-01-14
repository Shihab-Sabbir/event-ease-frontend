export const apiCall = async (url, method = "GET", data = null) => {
    const token = (() => {
        try {
            return JSON.parse(localStorage.getItem("event-ease-token"))?.token || null;
        } catch {
            return null;
        }
    })();


    const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
    };

    const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1${url}`, options);

        const responseBody = await response.json();
        if (!response.ok) {

            throw new Error(responseBody.message || "An unexpected error occurred.");
        }

        return responseBody;
    } catch (error) {

        console.error("API Error: ", error.message);
        throw new Error(error.message || "An unexpected error occurred.");
    }
};
