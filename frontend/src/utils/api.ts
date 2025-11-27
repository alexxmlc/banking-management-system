const BASE_URL = ""; // Relative path due to proxy

export const request = async <T>(endpoint: string, method: string = "GET", body: any = null): Promise<T | null> => {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // For DELETE requests that return 204 No Content
    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed: ${response.status}`);
    }

    // If response has body, parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        // If it's text, we might need to cast or handle differently depending on T
        return response.text() as unknown as T;
    }
};