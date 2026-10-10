"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function ProfileCard({ name, email }: { name: string | null; email: string }) {
  const router = useRouter();
  const initialName = name ?? "";
  const [displayName, setDisplayName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveName(event: SubmitEvent) {
    event.preventDefault();
    setSavingName(true);
    const { error } = await authClient.updateUser({ name: displayName.trim() });
    setSavingName(false);
    if (error) {
      toast.error(error.message ?? "Could not save profile");
      return;
    }
    toast.success("Profile saved");
    router.refresh();
  }

  async function savePassword(event: SubmitEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordError(null);
    setSavingPassword(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setSavingPassword(false);
    if (error) {
      setPasswordError(error.message ?? "Could not change password");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your admin display name and password.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={saveName} className="grid gap-3">
          <Field>
            <FieldLabel htmlFor="profile-name">Display name</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="profile-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
              />
              <Button
                type="submit"
                disabled={savingName || !displayName.trim() || displayName === initialName}
              >
                {savingName ? "Saving..." : "Save"}
              </Button>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input id="profile-email" value={email} disabled />
          </Field>
        </form>
        <form onSubmit={savePassword} className="grid gap-3 border-t pt-6">
          <Field>
            <FieldLabel htmlFor="profile-current-password">Current password</FieldLabel>
            <Input
              id="profile-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-new-password">New password</FieldLabel>
            <Input
              id="profile-new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Field data-invalid={passwordError !== null}>
            <FieldLabel htmlFor="profile-confirm-password">Confirm new password</FieldLabel>
            <Input
              id="profile-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              aria-invalid={passwordError !== null}
            />
            {passwordError ? <FieldError errors={[{ message: passwordError }]} /> : null}
          </Field>
          <Button
            type="submit"
            variant="outline"
            disabled={savingPassword || !currentPassword || !newPassword}
            className="justify-self-start"
          >
            {savingPassword ? "Changing..." : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
