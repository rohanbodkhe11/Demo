import { NextResponse } from "next/server";
import { getUsers } from "@/lib/data";

export async function GET(request: Request) {
  // Dev-only guard
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email query param" }, { status: 400 });
  }

  const users = getUsers();
  const user = users.find((u) => String(u.email).toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Remove sensitive fields (password)
  const safeUser = { ...user } as any;
  if ("password" in safeUser) delete safeUser.password;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Dev Login As</title>
  </head>
  <body>
    <p>Logging in as ${String(safeUser.name ?? safeUser.email)}...</p>
    <script>
      try {
        const user = ${JSON.stringify(safeUser)};
        localStorage.setItem('user', JSON.stringify(user));
        location.replace('/courses/new');
      } catch (e) {
        document.body.innerText = 'Failed to set localStorage: ' + e;
      }
    </script>
  </body>
</html>`;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
