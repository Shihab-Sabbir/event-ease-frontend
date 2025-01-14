'use client';

import React, { useState, useEffect } from "react";
import { CalendarIcon, MapPinIcon, UsersIcon, PencilIcon } from 'lucide-react';
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

const EditEventModal = ({ event, updateEvent, setSelectedEvent }) => {
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Formats date as 'yyyy-mm-dd'
    };

    const [updatedEvent, setUpdatedEvent] = useState({
        name: event.name,
        date: formatDate(event.date), // Format the date here
        location: event.location,
        maxAttendees: event.maxAttendees,
    });

    useEffect(() => {
        setUpdatedEvent({
            name: event.name,
            date: formatDate(event.date), // Format the date here
            location: event.location,
            maxAttendees: event.maxAttendees,
        });
    }, [event]);

    return (
        <Dialog open={!!event} onOpenChange={(open) => !open && setSelectedEvent(null)}>
            <DialogTrigger>
                <Button variant="outline" size="icon">
                    <PencilIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold uppercase pb-2">Edit Event</DialogTitle>
                    <DialogDescription>
                        Make changes to your event here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateEvent(updatedEvent);
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Event Name
                            </Label>
                            <Input
                                id="name"
                                value={updatedEvent.name}
                                onChange={(e) =>
                                    setUpdatedEvent({ ...updatedEvent, name: e.target.value })
                                }
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium">
                                Event Date
                            </Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    id="date"
                                    type="date"
                                    value={updatedEvent.date}
                                    onChange={(e) =>
                                        setUpdatedEvent({ ...updatedEvent, date: e.target.value })
                                    }
                                    className="w-full pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium">
                                Location
                            </Label>
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    id="location"
                                    value={updatedEvent.location}
                                    onChange={(e) =>
                                        setUpdatedEvent({ ...updatedEvent, location: e.target.value })
                                    }
                                    className="w-full pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxAttendees" className="text-sm font-medium">
                                Max Attendees
                            </Label>
                            <div className="relative">
                                <UsersIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    id="maxAttendees"
                                    type="number"
                                    value={updatedEvent.maxAttendees}
                                    onChange={(e) =>
                                        setUpdatedEvent({ ...updatedEvent, maxAttendees: Number(e.target.value) })
                                    }
                                    className="w-full pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start items-center">
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Save Changes
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="w-full mt-2">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditEventModal;
