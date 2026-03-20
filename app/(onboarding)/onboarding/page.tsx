"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { CreateProjectStep } from "@/components/onboarding/CreateProjectStep";
import { InviteMembersStep } from "@/components/onboarding/InviteMembersStep";
import { CreateFirstTaskStep } from "@/components/onboarding/CreateFirstTaskStep";
import { OnboardingSuccess } from "@/components/onboarding/OnboardingSuccess";
import { OnboardingSkeleton } from "@/components/onboarding/OnboardingSkeleton";
import { ToastContainer } from "@/components/auth/ToastContainer";

type Invite = { email: string; role: "Member" | "Manager" };

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  // Step 1 project
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Step 2 invites
  const [invites, setInvites] = useState<Invite[]>([]);

  // Step 3 task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [taskAssignee, setTaskAssignee] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const onExit = () => router.push("/workspace-selector");

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setToast("Project created");
    setCurrentStep(2);
  };

  const handleInvitesContinue = () => {
    setToast(invites.length ? "Invites sent" : "Skipped invites");
    setCurrentStep(3);
  };

  const handleTaskFinish = () => {
    if (!taskTitle.trim()) return;
    setToast("Task created");
    setCurrentStep(4);
  };

  const assignees = useMemo(() => invites.map((i) => ({ email: i.email, role: i.role })), [invites]);

  if (loading) {
    return (
      <OnboardingLayout onExit={onExit}>
        <OnboardingSkeleton />
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout onExit={onExit}>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <OnboardingStepper current={currentStep === 4 ? 3 : currentStep} />
        </div>
        <div className="lg:col-span-8">
          {currentStep === 1 && (
            <CreateProjectStep
              name={projectName}
              description={projectDescription}
              onChange={(field, value) => {
                if (field === "name") setProjectName(value);
                if (field === "description") setProjectDescription(value);
              }}
              onSkip={() => setCurrentStep(2)}
              onSubmit={handleProjectSubmit}
            />
          )}
          {currentStep === 2 && (
            <InviteMembersStep
              invites={invites}
              onInvitesChange={setInvites}
              onSkip={() => setCurrentStep(3)}
              onContinue={handleInvitesContinue}
            />
          )}
          {currentStep === 3 && (
            <CreateFirstTaskStep
              title={taskTitle}
              description={taskDescription}
              dueDate={taskDue}
              priority={taskPriority}
              assignee={taskAssignee}
              assignees={assignees}
              onChange={(field, value) => {
                if (field === "title") setTaskTitle(value);
                if (field === "description") setTaskDescription(value);
                if (field === "dueDate") setTaskDue(value);
                if (field === "priority") setTaskPriority(value as typeof taskPriority);
                if (field === "assignee") setTaskAssignee(value);
              }}
              onSkip={() => setCurrentStep(4)}
              onSubmit={handleTaskFinish}
            />
          )}
          {currentStep === 4 && <OnboardingSuccess onFinish={() => {
            const slug = typeof window !== "undefined" ? sessionStorage.getItem("onboarding_workspace_slug") : null;
            router.push(`/${slug || "workspace"}/dashboard`);
          }} />}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-slate-500">
        Need help setting up?{" "}
        <a className="text-primary hover:underline" href="#">
          Read our project guide
        </a>
      </p>
      <ToastContainer message={toast} onClose={() => setToast(null)} />
    </OnboardingLayout>
  );
}
