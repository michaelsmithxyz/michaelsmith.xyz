import { Status } from '@michaelsmith.xyz/utils/http';

export default {
  fetch(): Response {
    return Response.redirect('https://www.jaguars.com', Status.TemporaryRedirect);
  },
} satisfies ExportedHandler<Env>;
