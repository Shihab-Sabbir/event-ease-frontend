import React, { useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/app/utils/api";
import { Copy } from "lucide-react";

const socket = io('http://localhost:5001');

const CreateEventModal = ({ user, fetchEvents }) => {
    const [newEvent, setNewEvent] = useState({
        name: "",
        date: "",
        location: "",
        maxAttendees: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

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
            fetchEvents();  // Refresh events list
        } catch (err) {
            toast.error(err.message || "Failed to create event.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full ">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Event</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription>Fill in the details to create a new event</DialogDescription>
                    </DialogHeader>

                    {/* Event Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createEvent(newEvent);
                        }}
                    >
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Event Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter event name"
                                    value={newEvent.name}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, name: e.target.value })
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="date">Event Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, date: e.target.value })
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="Enter location"
                                    value={newEvent.location}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, location: e.target.value })
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxAttendees">Max Attendees</Label>
                                <Input
                                    id="maxAttendees"
                                    type="number"
                                    value={newEvent.maxAttendees}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, maxAttendees: Number(e.target.value) })
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500"}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading..' : "Create Event"}
                            </Button>
                        </div>
                    </form>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateEventModal;
