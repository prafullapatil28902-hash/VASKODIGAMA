import { CoordinateMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-grid flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-5 text-center">
      <CoordinateMark className="h-12 w-12" />
      <p className="eyebrow mt-6">Signal lost · 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        No coordinates found here
      </h1>
      <p className="mt-2 max-w-md text-[15px] text-muted">
        This route is off the map. Return to the workspace to continue your
        research.
      </p>
      <div className="mt-7 flex gap-3">
        <ButtonLink href="/" variant="secondary">Back home</ButtonLink>
        <ButtonLink href="/explore">Open Research Workspace</ButtonLink>
      </div>
    </div>
  );
}
