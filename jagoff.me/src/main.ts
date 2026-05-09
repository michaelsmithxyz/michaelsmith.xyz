export default {
  fetch(): Response {
    return Response.redirect('https://www.jaguars.com', 307);
  },
} satisfies ExportedHandler<Env>;
