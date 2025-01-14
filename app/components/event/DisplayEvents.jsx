'use client';

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiCall } from "@/app/utils/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon } from 'lucide-react';

const DisplayEvents = ({ AllEvents }) => {
    const { user } = useUser();
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        try {
            let endpoint = "/event";
            if (!AllEvents && user) {
                endpoint = `/event?creatorId=${user.email}`;
            }
            const response = await apiCall(endpoint, "GET");
            setEvents(response?.data);
        } catch (err) {
            toast.error(err.message || "Failed to fetch events.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [AllEvents, user]);

    const registerForEvent = async (eventId) => {
        try {
            await apiCall(`/event/register/${eventId}`, "POST", {});
            toast.success("Registered successfully!");
            fetchEvents();
        } catch (err) {
            toast.error(err.message || "Failed to register for event.");
        }
    };

    return (
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
    );
};

export default DisplayEvents;

