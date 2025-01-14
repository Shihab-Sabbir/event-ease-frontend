import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const EventCardLoader = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, index) => (
                <Card key={index} className="flex flex-col animate-pulse">
                    <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full h-9 bg-gray-200 rounded"></div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default EventCardLoader;
