const BaseUrl = process.env.API_BASE_URL

export async function apiRequest(path : string, options?: RequestInit)
{
    const response = await fetch(`${BaseUrl}${path}`, options);
        if (!response.ok) 
            throw new Error('Erro no servidor.');
    return response;
}