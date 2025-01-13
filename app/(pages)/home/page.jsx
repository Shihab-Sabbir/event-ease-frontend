'use client'


import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useUser } from "@/app/context/UserContext";
import { apiCall } from "@/app/utils/api";
;
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/app/components/event/CreateEventModal";

const socket = io('http://localhost:5001');

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
        const socket = io('http://localhost:5001');

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
    }, [socket]);

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


    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-semibold text-center mb-6">Event Dashboard</h1>

            {user && (
                <CreateEventModal
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    createEvent={createEvent}
                    isLoading={isLoading}
                />
            )}


            {/* Event List */}
            <div className="space-y-4">
                {events?.map((event) => (
                    <Card key={event._id} className="border p-6">
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <p className="text-sm text-gray-500">
                            {event.date} at {event.location}
                        </p>
                        <p>Max Attendees: {event.maxAttendees}</p>
                        <p>Attendees: {event.attendees.length}</p>
                        <p>Created By: {event.createdBy}</p>

                        <Button
                            onClick={() => registerForEvent(event._id)}
                            disabled={event.attendees.length >= event.maxAttendees}
                            className="mt-4"
                        >
                            {event.attendees.length >= event.maxAttendees
                                ? "Event Full"
                                : "Register"}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
