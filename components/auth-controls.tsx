import { auth, isGoogleAuthConfigured, signIn, signOut } from "@/auth";

export async function AuthControls() {
  const session = await auth();
  const admin = session?.user?.isAdmin === true;

  if (!session?.user) {
    if (!isGoogleAuthConfigured()) {
      return (
        <span
          className="rounded-xl border bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500"
          title="Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to enable administrator login."
        >
          Login not configured
        </span>
      );
    }

    return (
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button className="button-secondary" type="submit">
          Admin sign in
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-36 truncate text-xs text-slate-500 sm:block">
        {admin ? "Admin" : session.user.email}
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="button-secondary" type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
}
