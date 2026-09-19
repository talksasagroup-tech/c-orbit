import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, SectionCard } from "@/components/common";
import type { Scope } from "@/components/entity-links";
import { countries, currencies, getMerchant } from "@/lib/mock-data";

export function SettingsPage({ scope, merchantId }: { scope: Scope; merchantId?: string | null }) {
  const merchant = merchantId ? getMerchant(merchantId) : undefined;
  const [notifications, setNotifications] = useState({ failures: true, daily: true, variance: true });

  if (scope === "admin") {
    return (
      <>
        <PageHeader title="Platform Settings" description="Defaults applied across every merchant workspace." />
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <SectionCard title="Platform identity">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform name</Label>
                  <Input id="platform-name" defaultValue="Paygate" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support email</Label>
                  <Input id="support-email" defaultValue="support@paygate.io" />
                </div>
                <div className="space-y-2">
                  <Label>Default country</Label>
                  <Select defaultValue="KE">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reporting currency</Label>
                  <Select defaultValue="KES">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Onboarding policy" description="Applies to every new merchant created on the platform.">
              <div className="space-y-4">
                {[
                  ["Require registration number", "Merchants must supply a business registration number."],
                  ["Require a payment channel at onboarding", "Block activation until one channel is configured."],
                  ["Auto-enable merchants after review", "Skip the manual activation step."],
                ].map(([title, description], i) => (
                  <div key={title} className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <Switch defaultChecked={i !== 2} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <SectionCard title="Provider availability" description="Control which providers merchants can connect.">
              <div className="space-y-4">
                {["Safaricom", "Airtel", "Equity Bank", "MTN", "Cardnet"].map((p, i) => (
                  <div key={p} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{p}</p>
                      <p className="text-xs text-muted-foreground">Available to merchants during channel setup</p>
                    </div>
                    <Switch defaultChecked={i < 4} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <SectionCard title="Administrator security">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Require two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Enforced for all platform administrators</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Log impersonation sessions</p>
                    <p className="text-xs text-muted-foreground">Every merchant view is written to the audit log</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue={30} className="max-w-32" />
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Platform settings saved")}>Save changes</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your business profile, security and notifications." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Business profile</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <SectionCard title="Business profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="biz-name">Business name</Label>
                <Input id="biz-name" defaultValue={merchant?.name ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trading-name">Trading name</Label>
                <Input id="trading-name" defaultValue={merchant?.tradingName ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-no">Registration number</Label>
                <Input id="reg-no" defaultValue={merchant?.registrationNumber ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Default currency</Label>
                <Select defaultValue={merchant?.currency ?? "KES"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Business address</Label>
                <Textarea id="address" defaultValue={merchant?.address ?? ""} />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <SectionCard title="Primary contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">Full name</Label>
                <Input id="c-name" defaultValue={merchant?.contact.name ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-role">Role</Label>
                <Input id="c-role" defaultValue={merchant?.contact.role ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" type="email" defaultValue={merchant?.contact.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-phone">Phone</Label>
                <Input id="c-phone" defaultValue={merchant?.contact.phone ?? ""} />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SectionCard title="Security">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Require a one-time code at every sign in</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Restrict API access by IP</p>
                  <p className="text-xs text-muted-foreground">Only allow requests from approved addresses</p>
                </div>
                <Switch />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <SectionCard title="Notifications">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm">Failed transaction alerts</p>
                <Switch
                  checked={notifications.failures}
                  onCheckedChange={(v) => setNotifications((n) => ({ ...n, failures: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Daily collection summary</p>
                <Switch
                  checked={notifications.daily}
                  onCheckedChange={(v) => setNotifications((n) => ({ ...n, daily: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Reconciliation variance alerts</p>
                <Switch
                  checked={notifications.variance}
                  onCheckedChange={(v) => setNotifications((n) => ({ ...n, variance: v }))}
                />
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </>
  );
}
