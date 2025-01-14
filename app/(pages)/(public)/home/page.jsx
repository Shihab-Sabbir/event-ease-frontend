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
import EventCard from "@/app/components/event/EventCard";
import EventCardLoader from "@/app/components/common/EventCardLoader";

const Dashboard = () => {
    const { user, logout, checkUser } = useUser();
    const [registedEvent, setRegistedEvent] = useState([]);
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
            // let filter = "/event";
            // if (user) {
            //     filter = `/event?creatorId=${user.email}`;
            // }
            const response = await apiCall("/event", "GET");
            setEvents(response?.data);
            if (user) {
                setEvents([])
                const registedEventData = response?.data?.filter(event => event.attendees.includes(user.email));
                const createdByUser = response?.data?.filter(event => event.createdBy === user.email)
                setEvents(createdByUser);
                setRegistedEvent(registedEventData)
            }
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
            {!isLoading && <h1 className="text-3xl font-semibold  mb-6">
                {user ? `Welcome, ${user.email}!` : "Welcome to the Event Dashboard"}
            </h1>}

            {/* Event count */}
            {!isLoading && (
                <div className="mb-6">
                    <h2 className="text-xl">
                        {user
                            ? events.length > 0
                                ? `You have created ${events.length} event${events.length !== 1 ? 's' : ''}.`
                                : "You haven't created any events yet."
                            : events.length > 0
                                ? `There are ${events.length} event${events.length !== 1 ? 's' : ''}.`
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


            {isLoading ? (
                <EventCardLoader />
            ) : (
                // Event List
                <div>
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
                    <div className="mt-6">
                        {user?.email && <div>
                            {registedEvent?.length > 0 ? (
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold mb-4">Your Registered Events</h2>
                                    <table className="table-auto w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-gray-300 px-4 py-2">Event Name</th>
                                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                                <th className="border border-gray-300 px-4 py-2">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registedEvent.map(event => (
                                                <tr key={event._id}>
                                                    <td className="border border-gray-300 px-4 py-2">{event.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{event.location}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>You do not have any registrations yet!</p>
                            )}

                        </div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

