import { Suspense } from "react";
import ClaimPageContent from "./ClaimPageContent";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading Claim Page...</div>}>
      <ClaimPageContent />
    </Suspense>
  );
}
