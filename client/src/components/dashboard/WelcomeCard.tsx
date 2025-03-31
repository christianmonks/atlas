import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { FlaskConical, Check, Clock } from "lucide-react";

interface WelcomeCardProps {
  activeTests: number;
  completedTests: number;
  pendingTests: number;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  activeTests,
  completedTests,
  pendingTests,
}) => {
  return (
    <Card className="overflow-hidden mb-6">
      <div className="px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Welcome to Atlas
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Your Matched Market Testing Platform for media campaign analysis
            </p>
          </div>
          <Link href="/create-test">
            <Button>Create New Test</Button>
          </Link>
        </div>
      </div>
      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900">
                Active Tests
              </div>
              <div className="text-2xl font-semibold text-primary">
                {activeTests}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900">
                Completed Tests
              </div>
              <div className="text-2xl font-semibold text-green-600">
                {completedTests}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900">
                Pending Tests
              </div>
              <div className="text-2xl font-semibold text-amber-600">
                {pendingTests}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
