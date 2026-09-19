import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { ChannelForm, emptyChannel, validateChannel, type ChannelFormValues } from "@/components/channel-form";
import { getMerchant } from "@/lib/mock-data";

export function AdminAddChannel({ merchantId }: { merchantId: string }) {
  const navigate = useNavigate();
  const merchant = getMerchant(merchantId);
  const [values, setValues] = useState<ChannelFormValues>(emptyChannel);
  const [errors, setErrors] = useState<Partial<Record<keyof ChannelFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function submit() {
    const next = validateChannel(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Fix the highlighted fields before saving");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success(`${values.name} connected for ${merchant?.name ?? "merchant"}`);
      navigate({ to: "/admin/merchants/$merchantId", params: { merchantId } });
    }, 900);
  }

  return (
    <>
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          <Link to="/admin/merchants/$merchantId" params={{ merchantId }}>
            <ArrowLeft className="size-4" /> {merchant?.name ?? "Merchant"}
          </Link>
        </Button>
        <PageHeader
          title="Add Payment Channel"
          description={`Connect another provider account for ${merchant?.name ?? "this merchant"}.`}
        />
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="space-y-6 pt-6">
          <ChannelForm values={values} errors={errors} onChange={(patch) => setValues({ ...values, ...patch })} />
          <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
            <Button asChild variant="outline">
              <Link to="/admin/merchants/$merchantId" params={{ merchantId }}>
                Cancel
              </Link>
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Add channel
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
