'use client'

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { apiCall } from "@/app/utils/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon } from 'lucide-react';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch events from backend
    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await apiCall("/event", "GET");
            setEvents(response?.data);
        } catch (err) {
            toast.error(err.message || "Failed to fetch events.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_URL}`);

        socket.on("connect", () => {
            console.log("Connected to Socket.io server!");
        });

        socket.on("new-attendee", (data) => {
            fetchEvents();
            toast.success(`New attendee registered for event ${data.eventName}`);
        });

        // Listen for event updates
        socket.on("event-update", (data) => {
            toast.success(`${data.message}`);
            fetchEvents();
        });

        return () => {
            socket.off("new-attendee");
            socket.off("event-update");
            socket.off("connect");
        };
    }, []);

    // Register for an event
    const registerForEvent = async (eventId) => {
        try {
            await apiCall(`/event/register/${eventId}`, "POST", {});
        } catch (err) {
            toast.error(err.message || "Failed to register for event.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-semibold text-center mb-6">All Events</h1>

            {/* Total events count */}
            <div className="text-center mb-6">
                <h2 className="text-xl">
                    {isLoading
                        ? "Loading events..."
                        : `Total Events: ${events.length}`
                    }
                </h2>
            </div>

            {!isLoading && (
                <div className="text-center mb-6">
                    <h2 className="text-xl">
                        {events.length > 0
                            ? `There are ${events.length} event${events.length !== 1 ? 's' : ''}.`
                            : 'No events available yet.'}
                    </h2>
                </div>
            )}

            {isLoading ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : (
                // Event List
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events?.map((event) => (
                        <Card key={event._id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPinIcon className="mr-2 h-4 w-4" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <UsersIcon className="mr-2 h-4 w-4" />
                                        <span>{event.attendees.length} / {event.maxAttendees} attendees</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Created by {event.createdBy}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() => registerForEvent(event._id)}
                                    disabled={event.attendees.length >= event.maxAttendees}
                                    className="w-full"
                                >
                                    {event.attendees.length >= event.maxAttendees
                                        ? "Event Full"
                                        : "Register"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllEvents;

