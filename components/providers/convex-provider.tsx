"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

export const ConvexClientProvider = ({
    children
}: {
    children: ReactNode;
}) => {
    const [convex, setConvex] = useState<ConvexReactClient | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_CONVEX_URL) {
            const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
            setConvex(client);
        }
        setIsInitialized(true);
    }, []);

    if (!isInitialized) {
        return null; // Don't render anything until we've tried to initialize
    }

    if (!convex) {
        return (
            <ClerkProvider 
                publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
                appearance={{
                    elements: {
                      footer: "hidden",
                    },
                }}
            >
                <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                        <p>Unable to connect to Convex.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Please check your environment configuration.
                        </p>
                    </div>
                </div>
            </ClerkProvider>
        );
    }

    return (
        <ClerkProvider 
         publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
         appearance={{
            elements: {
              footer: "hidden",
            },
          }}
        >
            <ConvexProviderWithClerk
                useAuth={useAuth}
                client={convex}
            >
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}