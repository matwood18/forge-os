import { UnresolvedIdentityResolver } from "./unresolved-resolver";

export async function runIdentityResolutionSmokeTest() {
  const resolver = new UnresolvedIdentityResolver();

  return resolver.resolve([
    {
      type: "email",
      value: "unknown@example.com",
    },
  ]);
}