"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {

    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Welcome to Nova Online.
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Nova is the connected IDE where <br />
                better, faster worker happens.
            </h3>
            <Button>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            {isLoading && (
                <Spinner />
            )}
            {!isAuthenticated && !isLoading && (
                <>
                    <SignInButton mode="modal">
                        <Button>
                            Login
                        </Button>
                    </SignInButton>
                </>
            )}
            {isAuthenticated && !isLoading && (
                <>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/spaces">
                            Enter Realtime
                        </Link>
                    </Button>
                    <UserButton 
                        afterSignOutUrl="/"
                    />
                </>
            )}
            <ModeToggle />
        </div>
    )
}