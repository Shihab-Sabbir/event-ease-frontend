'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useUser } from "@/app/context/UserContext";
import { apiCall } from "@/app/utils/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/app/components/event/CreateEventModal";
import EditEventModal from "@/app/components/event/EditEventModal";
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation'; // for redirect
import Link from "next/link";

const Dashboard = () => {
    const { user, logout, checkUser } = useUser();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: "",
        date: "",
        location: "",
        maxAttendees: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const router = useRouter(); // for redirecting

    // Check user status on load
    useEffect(() => {
        const checkUserStatus = async () => {
            await checkUser();
        };
        checkUserStatus();
    }, []);

    // Fetch events from backend
    const fetchEvents = async () => {
        try {
            const response = await apiCall(`/event`, "GET");
            setEvents(response?.data);
        } catch (err) {
            toast.error(err.message || "Failed to fetch events.");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        setIsLoading(true);
        fetchEvents();
    }, [user]);

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

    // Create a new event
    const createEvent = async (eventData) => {
        setIsLoading(true);
        try {
            const eventWithCreator = {
                ...eventData,
                createdBy: user.email, // Adding the current user's email as the creator
            };
            await apiCall("/event", "POST", eventWithCreator);
            toast.success("Event created successfully!");
            fetchEvents();
        } catch (err) {
            toast.error(err.message || "Failed to create event.");
        } finally {
            setIsLoading(false);
        }
    };

    // Register for an event
    const registerForEvent = async (eventId) => {
        try {
            await apiCall(`/event/register/${eventId}`, "POST", {});
        } catch (err) {
            toast.error(err.message || "Failed to register for event.");
        }
    };

    // Handle updating an event
    const updateEvent = async (updatedEventData) => {
        try {
            await apiCall(`/event/${selectedEvent._id}`, "PUT", updatedEventData);
            toast.success("Event updated successfully!");
            fetchEvents();
        } catch (err) {
            toast.error(err.message || "Failed to update event.");
        }
    };

    // Handle deleting an event
    const deleteEvent = async (eventId) => {
        try {
            await apiCall(`/event/${eventId}`, "DELETE");
            toast.success("Event deleted successfully!");
            fetchEvents();
        } catch (err) {
            toast.error(err.message || "Failed to delete event.");
        }
    };

    // Handle create event when user is not logged in
    const handleCreateEvent = () => {
        if (!user) {
            toast.error("You need to be logged in to create an event.");
            router.push("/auth/login"); // Redirect to login page
        } else {
            document.getElementById('create-event-button').click();
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            {/* Event count */}
            {!isLoading && (
                <div className="text-start text-xl mb-6">
                    <h2 className="text-lg uppercase font-bold">
                        {user
                            ? events.length > 0
                                ? `Total ${events.length} event${events.length !== 1 ? 's' : ''}.`
                                : 'You have no events yet.'
                            : events.length > 0
                                ? `Total ${events.length} event${events.length !== 1 ? 's' : ''} Running.`
                                : 'No events available yet.'}
                    </h2>
                </div>
            )}


            {user?.email ? (
                <CreateEventModal
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    createEvent={createEvent}
                    isLoading={isLoading}
                    buttonId="create-event-button"
                />
            ) : (
                <div className="text-start mt-6">
                    <p className="text-lg">To create an event, please <Link href="/auth/login" className="text-blue-600">login</Link>.</p>
                </div>
            )}

            {/* Edit Event Modal */}
            {selectedEvent && (
                <EditEventModal
                    event={selectedEvent}
                    updateEvent={updateEvent}
                    setSelectedEvent={setSelectedEvent}
                />
            )}

            {/* Show message if no events */}
            {!isLoading && events.length === 0 && (
                <div className="text-center mb-6">
                    <p>{user ? "You haven't created any events yet." : "No events available yet."}</p>
                    {user && (
                        <Button onClick={() => document.getElementById('create-event-button').click()} className="mt-4">
                            Create Your First Event
                        </Button>
                    )}
                    {!user && (
                        <p className="mt-4">
                            Please <a href="/auth/login" className="text-blue-500">log in</a> to create an event.
                        </p>
                    )}
                </div>
            )}

            {isLoading ? (
                // Loading Skeleton
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
            ) : (
                // Event List
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {events?.map((event) => (
                        <Card key={event._id} className="flex flex-col shadow-lg border rounded-lg overflow-hidden">
                            <CardHeader className="bg-gray-700 text-white p-4">
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
                            <CardFooter className="p-4 bg-gray-50 flex justify-between items-center gap-2">
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

