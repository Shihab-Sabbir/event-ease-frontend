'use client'

import React from "react";
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
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

const CreateEventModal = ({ newEvent, setNewEvent, isLoading, createEvent }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Create Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold uppercase pb-">Create New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new event. Click create when you&#39;re done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    createEvent(newEvent);
                }} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Event Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Enter event name"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
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
                                    placeholder="DD-MMM-YYYY"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
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
                                    placeholder="Enter location"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
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
                                    placeholder="Enter max attendees"
                                    value={newEvent.maxAttendees}
                                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: Number(e.target.value) })}
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : "Create Event"}
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

export default CreateEventModal;

