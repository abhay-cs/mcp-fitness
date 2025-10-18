"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconBrandOpenai, IconBrain, IconPlugConnectedX, IconPlus, IconRobot } from "@tabler/icons-react";
import { ClaudeLogo } from "@/components/icons/ClaudeLogo"
import { GeminiLogo } from "@/components/icons/GeminiLogo";
export default function IntegrationsPage() {
    const [connectedLLMs, setConnectedLLMs] = useState([
        { name: "OpenAI GPT", connected: true, model: "GPT-4o" },
        { name: "Claude", connected: false },
        { name: "Gemini", connected: false },
    ]);

    const handleConnect = (name: string) => {
        // TODO: Implement OAuth or API key flow here
        setConnectedLLMs(prev =>
            prev.map(llm => (llm.name === name ? { ...llm, connected: true } : llm))
        );
    };

    const handleDisconnect = (name: string) => {
        setConnectedLLMs(prev =>
            prev.map(llm => (llm.name === name ? { ...llm, connected: false } : llm))
        );
    };

    return (
        <div className="px-4 lg:px-6 py-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <IconRobot className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">AI Integrations</h1>
                    </div>
                    <p className="text-muted-foreground ml-9">
                        Manage which AI assistants can access and log your fitness data.
                    </p>
                </div>

                {/* Integration Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    {connectedLLMs.map((llm, index) => (
                        <Card
                            key={index}
                            className={`border-1 shadow-md transition ${llm.connected ? "bg-gradient-to-br from-green-50 to-emerald-50" : ""
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    {llm.name === "OpenAI GPT" && (
                                        <IconBrandOpenai className="h-5 w-5 text-primary" />
                                    )}
                                    {llm.name === "Claude" && (
                                        <ClaudeLogo className="w-6 h-6" />
                                    )}
                                    {llm.name === "Gemini" && (
                                        // <IconPlugConnectedX className="h-5 w-5 text-blue-500" />
                                        <GeminiLogo className="w-6 h-6" />
                                    )}
                                    {llm.name}
                                    {llm.connected && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs bg-green-100 text-green-700 ml-2"
                                        >
                                            Connected
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {llm.connected
                                        ? `This AI has access to your logs and can read/write data securely.`
                                        : `Not connected. Authorize this AI to access your logs.`}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex items-center justify-between">
                                <div>
                                    {llm.connected && llm.model && (
                                        <p className="text-sm text-muted-foreground">
                                            Model: <span className="font-medium">{llm.model}</span>
                                        </p>
                                    )}
                                </div>

                                {llm.connected ? (
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDisconnect(llm.name)}
                                    >
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleConnect(llm.name)}>
                                        <IconPlus className="mr-2 h-4 w-4" />
                                        Connect
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Separator />

                {/* Privacy Info */}
                <div className="text-sm text-muted-foreground text-center pt-4">
                    You control which AIs can access your fitness data. Disconnect anytime.
                </div>
            </div>
        </div>
    );
}