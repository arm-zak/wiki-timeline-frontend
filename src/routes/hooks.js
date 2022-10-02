export async function handle({ event, resolve }) {
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', event.url.pathname.split('/')[1])
    });

    return response;
}