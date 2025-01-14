import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon, PencilIcon, TrashIcon } from 'lucide-react';

export default function EventCard({ event, user, registerForEvent, setSelectedEvent, deleteEvent }) {
    return (
        <Card key={event._id} className="flex flex-col shadow-lg border rounded-lg overflow-hidden">
            <CardHeader className="bg-primary text-white p-4">
                <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <UsersIcon className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">
                        {event.attendees.length} / {event.maxAttendees} attendees
                    </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <UserIcon className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">Created by {event.createdBy}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 bg-gray-50 flex justify-between items-center">
                <Button
                    onClick={() => registerForEvent(event._id)}
                    disabled={event.attendees.length >= event.maxAttendees}
                    className={`w-full ${event.attendees.length >= event.maxAttendees
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                >
                    {event.attendees.length >= event.maxAttendees ? "Event Full" : "Register"}
                </Button>
                {user && event.createdBy === user.email && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setSelectedEvent(event)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                            size="icon"
                        >
                            <PencilIcon className="h-5 w-5 text-gray-700" />
                        </Button>
                        <Button
                            onClick={() => deleteEvent(event._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-md"
                            size="icon"
                        >
                            <TrashIcon className="h-5 w-5 text-red-500" />
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
