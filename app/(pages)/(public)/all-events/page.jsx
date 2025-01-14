'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useUser } from "@/app/context/UserContext";
import { apiCall } from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/app/components/event/CreateEventModal";
import EditEventModal from "@/app/components/event/EditEventModal";
import { useRouter } from 'next/navigation'; // for redirect
import Link from "next/link";
import EventCard from "@/app/components/event/EventCard";
import EventCardLoader from "@/app/components/common/EventCardLoader";

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
                <EventCardLoader/>
            ) : (
                // Event List
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {events?.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            user={user}
                            registerForEvent={registerForEvent}
                            setSelectedEvent={setSelectedEvent}
                            deleteEvent={deleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

