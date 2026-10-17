import { getAll, SITE_URL } from "@/lib/content";
export const dynamic = "force-static";
export function GET() {
  return Response.json(getAll().map(({ body, ...useCase }) => ({
    ...useCase,
    url: `${SITE_URL}/use-cases/${useCase.slug}`,
  })));
}
