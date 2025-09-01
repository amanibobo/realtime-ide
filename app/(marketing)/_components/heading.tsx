"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VideoPlayerDemo } from "@/components/ui/demo";

export const Heading = () => {

    const { isAuthenticated: convexAuth, isLoading: convexLoading } = useConvexAuth();
    const { isSignedIn: clerkAuth, isLoaded: clerkLoaded } = useAuth();
    const router = useRouter();
    
    // Use Clerk auth state as primary, Convex as secondary
    const isAuthenticated = clerkLoaded ? clerkAuth : convexAuth;
    const isLoading = !clerkLoaded || convexLoading;

    useEffect(() => {
        // If user is authenticated and not loading, redirect to spaces
        if (isAuthenticated && !isLoading) {
            router.push("/spaces");
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="relative my-10">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle floating dots */}
                <div className="absolute top-20 left-10 w-2 h-2 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse opacity-40"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-60 left-20 w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-40 right-10 w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Subtle gradient orbs */}
                <div className="absolute top-32 right-1/4 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '5s' }}></div>
            </div>

                        <div className="text-center max-w-4xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Main Content */}
                <div className="mb-16 sm:mb-20 lg:mb-24">
                    {/* Title with subtle animation */}
                    <div className="mb-6 sm:mb-8 transform transition-all duration-1000 ease-out animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white tracking-tight leading-none">
                            Nova
                        </h1>
                        {/* Subtle underline animation */}
                        <div className="mx-auto mt-3 sm:mt-4 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent opacity-50"></div>
                    </div>
                    
                    {/* CTA Section - Moved up */}
                    <div className="space-y-4 sm:space-y-6 mb-16 sm:mb-20 transform transition-all duration-1000 ease-out animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
                        {isLoading && (
                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <Spinner />
                                <span className="text-gray-400 dark:text-gray-600 font-light text-sm sm:text-base">Loading...</span>
                            </div>
                        )}
                        
                        {!isAuthenticated && !isLoading && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4">
                                    <SignInButton mode="modal">
                                        <Button 
                                            size="lg" 
                                            className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-light border-0 rounded-none transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            Get Started
                                            <ArrowRight className="w-4 h-4 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </SignInButton>
                                    <ModeToggle />
                                </div>
                                <div>
                                    <SignInButton mode="modal">
                                        <button className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors font-light text-xs sm:text-sm underline underline-offset-4 hover:underline-offset-8 transition-all duration-300">
                                            Already have an account? Sign in
                                        </button>
                                    </SignInButton>
                                </div>
                            </div>
                        )}
                        
                        {isAuthenticated && !isLoading && (
                            <div className="flex items-center justify-center gap-4">
                                <Button 
                                    size="lg" 
                                    asChild 
                                    className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-light border-0 rounded-none transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Link href="/spaces" className="group">
                                        Open Workspace
                                        <ArrowRight className="w-4 h-4 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <ModeToggle />
                            </div>
                        )}
                    </div>
                    
                    {/* Video Player Demo - Moved below CTA */}
                    <div className="max-w-4xl mx-auto mb-16 sm:mb-20 transform transition-all duration-1000 ease-out animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '600ms' }}>
                        <VideoPlayerDemo />
                    </div>
                </div>


            </div>
        </div>
    )
}