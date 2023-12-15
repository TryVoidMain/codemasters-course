const SERVER_URL = 'http://localhost:3000/';

export async function get<T>(url: string): Promise<T> {
    const api = `${SERVER_URL}${url}`;

    return (await fetch(api)).json();
}

export async function post<T, U>(url:string, req: T): Promise<U> {
    const api = `${SERVER_URL}${url}`;
    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    }

    return (await fetch(api, options)).json();
}