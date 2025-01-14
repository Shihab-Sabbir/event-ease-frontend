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
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon, PencilIcon } from 'lucide-react';

const Dashboard = () => {
    const { user, logout, checkUser } = useUser();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: "",
        date: "",
        location: "",
        maxAttendees: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);  // State for the selected event to edit

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
            const response = await apiCall("/event", "GET");
            setEvents(response?.data);
        } catch (err) {
            toast.error(err.message || "Failed to fetch events.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on("connect", () => {
            console.log("Connected to Socket.io server!");
        });

        socket.on("new-attendee", (data) => {
            fetchEvents();
            console.log("io is triggered!", { data });
            toast.success(`New attendee registered for event ${data.eventName}`);
        });

        // Listen for event updates
        socket.on("event-update", (data) => {
            console.log("io is triggered!", { data });
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

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-semibold text-center mb-6">Event Dashboard</h1>

            {/* Create Event Form */}
            {user && (
                <CreateEventModal
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    createEvent={createEvent}
                    isLoading={isLoading}
                />
            )}

            {/* Edit Event Modal */}
            {selectedEvent && (
                <EditEventModal
                    event={selectedEvent}
                    updateEvent={updateEvent}
                    setSelectedEvent={setSelectedEvent}
                />
            )}

            {/* Event List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
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
                        <CardFooter >
                            <div className="flex items-center w-full gap-4">
                                <Button
                                    onClick={() => registerForEvent(event._id)}
                                    disabled={event.attendees.length >= event.maxAttendees}
                                    className="w-full"
                                >
                                    {event.attendees.length >= event.maxAttendees
                                        ? "Event Full"
                                        : "Register"}
                                </Button>
                                {user && event.createdBy === user.email && (
                                    <Button
                                        onClick={() => setSelectedEvent(event)}
                                        className="px-5 border"
                                        variant="default" size="icon"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
